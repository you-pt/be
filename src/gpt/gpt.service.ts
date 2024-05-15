import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { dietManagerWithCsv, imageToText, translateUseCase } from './use-cases';
import {
  ProcessImageAndManageDietDto,
  ProsConsDiscusserDto,
  TranslateDto,
} from './dtos';
import { FoodItem } from 'src/entities/foodItem.entity';
import { Meal } from 'src/entities/meals.entity';
import OpenAI from 'openai';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GptService {
  constructor(
    @InjectRepository(FoodItem)
    private foodItemRepository: Repository<FoodItem>,
    @InjectRepository(Meal)
    private mealRepository: Repository<Meal>,
    private httpService: HttpService,
  ) {}
  private openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  public async imageToText(prosConsDiscusserDto: ProsConsDiscusserDto) {
    return await imageToText(this.openai, {
      prompt: prosConsDiscusserDto.prompt,
    });
  }

  public async dietManagerWithDB(prosConsDiscusserDto: ProsConsDiscusserDto) {
    const csvDataArray = await this.getFoodItemData();
    const csvDataString = JSON.stringify(csvDataArray);
    return await dietManagerWithCsv(this.openai, {
      prompt: prosConsDiscusserDto.prompt,
      csvData: csvDataString,
    });
  }

  public async processImageAndManageDietDB(
    processImageAndManageDietDto: ProcessImageAndManageDietDto,
  ): Promise<any> {
    try {
      const imageText = await imageToText(this.openai, {
        prompt: processImageAndManageDietDto.imageUrl,
      });
      const csvDataArray = await this.getFoodItemData();
      const csvDataString = JSON.stringify(csvDataArray);
      const dietResponse = await dietManagerWithCsv(this.openai, {
        prompt: imageText.content,
        csvData: csvDataString,
      });

      const parsedDietResponse = JSON.parse(dietResponse.content);
      const translatedEvaluation = await this.translateText2({
        prompt: parsedDietResponse.reportAI.Evaluation,
      });

      parsedDietResponse.reportAI.EvaluationTranslated = translatedEvaluation;

      return parsedDietResponse;
    } catch (error) {
      throw new HttpException(
        '요청 처리 실패. 다시 시도해 주세요.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async translateText({ lang, prompt }: TranslateDto) {
    return await translateUseCase(this.openai, {
      prompt,
      lang,
    });
  }

  private async translateText2({
    prompt,
  }: {
    prompt: string;
  }): Promise<string> {
    const encodedParams = new URLSearchParams();
    encodedParams.append('from', 'auto'); // 자동 언어 감지로 변경
    encodedParams.append('to', 'ko');
    encodedParams.append('text', prompt);

    const options = {
      method: 'POST',
      url: 'https://google-translate113.p.rapidapi.com/api/v1/translator/text',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'google-translate113.p.rapidapi.com',
      },
      data: encodedParams,
    };

    try {
      const response = await firstValueFrom(this.httpService.request(options));
      const translation = response.data;
      return translation.trans;
    } catch (error) {
      console.error('Error in translation:', error);
      throw error;
    }
  }

  public async saveMealResult(userId: number, reportAI: string): Promise<Meal> {
    const meal = this.mealRepository.create({
      userId,
      reportAI,
    });

    return this.mealRepository.save(meal);
  }

  async updateMeal(mealId: number, newReport: string): Promise<Meal> {
    const meal = await this.mealRepository.findOneBy({ mealId });
    if (!meal) {
      throw new Error('Meal not found');
    }
    meal.report = newReport || meal.report;
    await this.mealRepository.save(meal);
    return meal;
  }

  private async getFoodItemData(): Promise<string[]> {
    const foodItems = await this.foodItemRepository
      .createQueryBuilder('foodItem')
      .select([
        'foodItem.foodName',
        'foodItem.energy',
        'foodItem.carbohydrate',
        'foodItem.fat',
        'foodItem.protein',
      ])
      .getMany();

    return foodItems.map(
      (item) =>
        `${item.foodName} : energy:${item.energy} kcal, carbohydrate:${item.carbohydrate} g, fat:${item.fat} g, protein:${item.protein} g`,
    );
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  dietManagerWithCsv,
  imageToText,
  prosConsDiscusserStreamUseCase,
  translateUseCase,
} from './use-cases';
import {
  ProcessImageAndManageDietDto,
  ProsConsDiscusserDto,
  TranslateDto,
} from './dtos';
import { FoodItem } from 'src/entities/foodItem.entity';
import OpenAI from 'openai';
import * as fs from 'fs';
import csv from 'csv-parser';

@Injectable()
export class GptService {
  constructor(
    @InjectRepository(FoodItem)
    private foodItemRepository: Repository<FoodItem>,
  ) {}
  private openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  public async imageToText(prosConsDiscusserDto: ProsConsDiscusserDto) {
    return await imageToText(this.openai, {
      prompt: prosConsDiscusserDto.prompt,
    });
  }

  public async dietManagerWithCsvUsingLocalData(
    prosConsDiscusserDto: ProsConsDiscusserDto,
  ) {
    const csvDataArray = await this.readLocalCsv();
    const csvDataString = JSON.stringify(csvDataArray);
    return await dietManagerWithCsv(this.openai, {
      prompt: prosConsDiscusserDto.prompt,
      csvData: csvDataString,
    });
  }

  public async processImageAndManageDiet(
    processImageAndManageDietDto: ProcessImageAndManageDietDto,
  ): Promise<string> {
    const imageText = await imageToText(this.openai, {
      prompt: processImageAndManageDietDto.imageUrl,
    });

    const csvDataArray = await this.readLocalCsv();
    const csvDataString = JSON.stringify(csvDataArray);

    const dietResponse = await dietManagerWithCsv(this.openai, {
      prompt: imageText.content,
      csvData: csvDataString,
    });

    return dietResponse.content;
  }

  public async prosConsDiscusserStream(
    prosConsDiscusserDto: ProsConsDiscusserDto,
  ) {
    return await prosConsDiscusserStreamUseCase(this.openai, {
      prompt: prosConsDiscusserDto.prompt,
    });
  }

  public async translateText({ lang, prompt }: TranslateDto) {
    return await translateUseCase(this.openai, {
      prompt,
      lang,
    });
  }

  // csv파일을 db에 올린 흔적... -> 다신 안씀 ㅋㅋㅋㅋㅋ
  // public async saveCsvOnDb(): Promise<void> {
  //   const filePath = 'food_ai_db.csv';

  //   return new Promise((resolve, reject) => {
  //     const results = [];
  //     fs.createReadStream(filePath)
  //       .pipe(csv())
  //       .on('data', (data) => {
  //         results.push({
  //           foodName: data['\ufeff음 식 명'],
  //           weight: parseFloat(data['중량(g)']),
  //           energy: parseFloat(data['에너지(kcal)']),
  //           carbohydrate: parseFloat(data['탄수화물(g)']),
  //           sugar: parseFloat(data['당류(g)']),
  //           fat: parseFloat(data['지방(g)']),
  //           protein: parseFloat(data['단백질(g)']),
  //           calcium: parseFloat(data['칼슘(mg)']),
  //           phosphorus: parseFloat(data['인(mg)']),
  //           sodium: parseFloat(data['나트륨(mg)']),
  //           potassium: parseFloat(data['칼륨(mg)']),
  //           magnesium: parseFloat(data['마그네슘(mg)']),
  //           iron: parseFloat(data['철(mg)']),
  //           zinc: parseFloat(data['아연(mg)']),
  //           cholesterol: parseFloat(data['콜레스테롤(mg)']),
  //           transFats: parseFloat(data['트랜스지방(g)']),
  //         });
  //       })
  //       .on('end', async () => {
  //         try {
  //           await this.foodItemRepository.save(results);
  //           resolve();
  //         } catch (error) {
  //           reject(error);
  //         }
  //       })
  //       .on('error', (error) => reject(error));
  //   });
  // }

  // file IO -> fileblocking 발생.
  // filestream -> 닫힐때 까지 다른 스트림 생성 불가.
  // 동시성을 막고있는 가장 큰 문제는 이 로직으로 보인다.
  // DBMS가 처리하게 해버리면 좋다.
  private async readLocalCsv(): Promise<any[]> {
    const filePath = 'food_ai_db.csv';
    return new Promise((resolve, reject) => {
      const results = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
          const extractedData = {
            foodName: data['\ufeff음 식 명'],
            calories: data['에너지(kcal)'],
            carbs: data['탄수화물(g)'],
            protein: data['단백질(g)'],
          };
          results.push(extractedData);
        })
        .on('end', () => resolve(results))
        .on('error', (error) => reject(error));
    });
  }
}

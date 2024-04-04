import { Injectable } from '@nestjs/common';
import {
  dietManager,
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
import OpenAI from 'openai';
import * as fs from 'fs';
import csv from 'csv-parser';

@Injectable()
export class GptService {
  private openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  public async dietManager(prosConsDiscusserDto: ProsConsDiscusserDto) {
    return await dietManager(this.openai, {
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

  public async imageToText(prosConsDiscusserDto: ProsConsDiscusserDto) {
    return await imageToText(this.openai, {
      prompt: prosConsDiscusserDto.prompt,
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

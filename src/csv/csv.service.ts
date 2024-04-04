import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import csv from 'csv-parser';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';

@Injectable()
export class CsvService {
  constructor(private httpService: HttpService) {}

  readLocalCsv(filePath: string): Promise<any[]> {
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
        .on('end', () => {
          resolve(results);
        })
        .on('error', (error) => reject(error));
    });
  }

  readCsvFromUrl(url: string): Observable<any> {
    return this.httpService.get(url, { responseType: 'stream' }).pipe();
  }

  saveAsJsonl(data: any[], jsonlFilePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const stream = fs.createWriteStream(jsonlFilePath);
      data.forEach((item, index) => {
        stream.write(
          JSON.stringify(item) + (index < data.length - 1 ? '\n' : ''),
        );
      });
      stream.end();
      stream.on('finish', resolve);
      stream.on('error', reject);
    });
  }
}

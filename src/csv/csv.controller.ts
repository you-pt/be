import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { CsvService } from './csv.service';

@Controller('csv')
export class CsvController {
  constructor(private readonly csvService: CsvService) {}

  @Get()
  async getCsvData() {
    const filePath = 'food_ai_db.csv';
    return await this.csvService
      .readLocalCsv(filePath)
      .then((data) => {
        return this.csvService.saveAsJsonl(data, 'food_ai_db.jsonl');
      })
      .then(() => {})
      .catch((error) => {
        console.error('Error:', error);
      });
  }
}

import { Module } from '@nestjs/common';
import { CsvService } from './csv.service';
import { HttpModule } from '@nestjs/axios';
import { CsvController } from './csv.controller';

@Module({
  imports: [HttpModule],
  providers: [CsvService],
  exports: [CsvService],
  controllers: [CsvController],
})
export class CsvModule {}

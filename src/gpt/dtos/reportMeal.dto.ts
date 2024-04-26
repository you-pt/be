import { IsString, IsOptional } from 'class-validator';

export class ReportMealDto {
  @IsOptional()
  @IsString()
  report?: string;
}

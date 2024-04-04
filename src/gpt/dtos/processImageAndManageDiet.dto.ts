import { IsString } from 'class-validator';

export class ProcessImageAndManageDietDto {
  @IsString()
  readonly imageUrl: string;

  readonly csvData?: string;
}

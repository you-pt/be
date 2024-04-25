import { IsString, IsOptional } from 'class-validator';

export class SaveResultDto {
  readonly reportAI: any;

  @IsOptional()
  @IsString()
  readonly report?: string | null = null;
}

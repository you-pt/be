import {
  IsString,
  IsNotEmpty,
  Length,
  IsNumber,
  Matches,
} from 'class-validator';

export class CreateScheduleDto {
  @IsString()
  @IsNotEmpty({ message: 'PT 날짜를 입력해주세요.' })
  @Matches(/^\d{4}-\d{1,2}-\d{1,2}$/)
  ptDate: string;

  @IsString()
  @IsNotEmpty({ message: 'PT 시간을 입력해주세요.' })
  @Matches(/^\d{1,2}:\d{1,2}$/)
  ptTime: string;

  @IsString()
  @IsNotEmpty({ message: '내용을 입력해주세요.' })
  content: string;

  @IsNumber()
  @IsNotEmpty({ message: '유저 ID를 입력해주세요' })
  userId: number;
}

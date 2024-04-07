import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { GptService } from './gpt.service';
import {
  ProsConsDiscusserDto,
  TranslateDto,
  ProcessImageAndManageDietDto,
} from './dtos';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('imageToText')
  public async imageToText(@Body() prosConsDiscusserDto: ProsConsDiscusserDto) {
    return this.gptService.imageToText(prosConsDiscusserDto);
  }

  // @Post('dietManagerWithCsv')
  // public async dietManagerWithCsv(
  //   @Body() prosConsDiscusserDto: ProsConsDiscusserDto,
  // ) {
  //   return this.gptService.dietManagerWithCsvUsingLocalData(
  //     prosConsDiscusserDto,
  //   );
  // }

  @Post('dietManagerWithDB')
  public async dietManagerWithDB(
    @Body() prosConsDiscusserDto: ProsConsDiscusserDto,
  ) {
    return this.gptService.dietManagerWithDB(prosConsDiscusserDto);
  }

  // @Post('processImageAndManageDiet')
  // public async processImageAndManageDiet(
  //   @Body() processImageAndManageDietDto: ProcessImageAndManageDietDto,
  // ) {
  //   return this.gptService.processImageAndManageDiet(
  //     processImageAndManageDietDto,
  //   );
  // }

  @Post('processImageAndManageDietDB')
  public async processImageAndManageDietDB(
    @Body() processImageAndManageDietDto: ProcessImageAndManageDietDto,
  ) {
    return this.gptService.processImageAndManageDietDB(
      processImageAndManageDietDto,
    );
  }

  @Post('translate')
  translateText(@Body() translateDto: TranslateDto) {
    return this.gptService.translateText(translateDto);
  }

  // DB에 csv파일 내용 올리는 함수
  // @Post('saveCsvOnDb')
  // async uploadCsv(@Res() response: Response) {
  //   try {
  //     await this.gptService.saveCsvOnDb();
  //     return response.status(HttpStatus.OK).json({
  //       message: 'CSV가 성공적으로 저장되었습니다.',
  //     });
  //   } catch (error) {
  //     return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
  //       message: 'CSV업로드중 Error 발생 ',
  //       error: error.message,
  //     });
  //   }
  // }
}

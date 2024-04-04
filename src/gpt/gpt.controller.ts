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

  @Post('dietManager')
  public async dietManager(@Body() prosConsDiscusserDto: ProsConsDiscusserDto) {
    return this.gptService.dietManager(prosConsDiscusserDto);
  }

  @Post('imageToText')
  public async imageToText(@Body() prosConsDiscusserDto: ProsConsDiscusserDto) {
    return this.gptService.imageToText(prosConsDiscusserDto);
  }

  @Post('dietManagerWithCsv')
  public async dietManagerWithCsv(
    @Body() prosConsDiscusserDto: ProsConsDiscusserDto,
  ) {
    return this.gptService.dietManagerWithCsvUsingLocalData(
      prosConsDiscusserDto,
    );
  }

  @Post('translate')
  translateText(@Body() translateDto: TranslateDto) {
    return this.gptService.translateText(translateDto);
  }

  @Post('processImageAndManageDiet')
  public async processImageAndManageDiet(
    @Body() processImageAndManageDietDto: ProcessImageAndManageDietDto,
  ) {
    return this.gptService.processImageAndManageDiet(
      processImageAndManageDietDto,
    );
  }

  @Post('pros-cons-discusser-stream')
  public async prosConsDiscusserStream(
    @Body() prosConsDiscusserDto: ProsConsDiscusserDto,
    @Res() res: Response,
  ) {
    const stream =
      await this.gptService.prosConsDiscusserStream(prosConsDiscusserDto);
    res.setHeader('Content-Type', 'application/json');
    res.status(HttpStatus.OK);
    for await (const chunk of stream) {
      const piece = chunk.choices[0].delta.content || '';
      res.write(piece);
    }
    res.end();
  }
}

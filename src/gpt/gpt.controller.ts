import {
  Body,
  Controller,
  // HttpStatus,
  UseInterceptors,
  Post,
  // Res,
  // Get,
} from '@nestjs/common';
// import { Response } from 'express';
import { GptService } from './gpt.service';
import {
  ProsConsDiscusserDto,
  TranslateDto,
  ProcessImageAndManageDietDto,
} from './dtos';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { TimeoutInterceptor } from 'utils/timeout.intercepter';

@ApiTags('AI')
@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @ApiOperation({ summary: 'gpt4로 이미지 인식' })
  @ApiBody({
    schema: {
      properties: {
        prompt: {
          type: 'string',
          example:
            'https://upload.wikimedia.org/wikipedia/commons/b/ba/Chicken_slider_combo_from_Dave%27s_Hot_Chicken.jpg',
        },
      },
    },
  })
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('imageToText')
  @UseInterceptors(TimeoutInterceptor)
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

  @ApiOperation({ summary: 'gpt3.5로 이미지에 대한 텍스트 생성' })
  @ApiBody({
    schema: {
      properties: {
        prompt: {
          type: 'string',
          example:
            'Menu: Chicken sandwiches with pickles, lettuce, and sauce. Side of crinkle-cut fries.',
        },
      },
    },
  })
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('dietManagerWithDB')
  @UseInterceptors(TimeoutInterceptor)
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

  @ApiOperation({ summary: '이미지 인식 + 텍스트 생성' })
  @ApiBody({
    schema: {
      properties: {
        imageUrl: {
          type: 'string',
          example:
            'https://upload.wikimedia.org/wikipedia/commons/b/ba/Chicken_slider_combo_from_Dave%27s_Hot_Chicken.jpg',
        },
      },
    },
  })
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('processImageAndManageDietDB')
  @UseInterceptors(TimeoutInterceptor)
  public async processImageAndManageDietDB(
    @Body() processImageAndManageDietDto: ProcessImageAndManageDietDto,
  ) {
    return this.gptService.processImageAndManageDietDB(
      processImageAndManageDietDto,
    );
  }

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('translate')
  @UseInterceptors(TimeoutInterceptor)
  translateText(@Body() translateDto: TranslateDto) {
    return this.gptService.translateText(translateDto);
  }

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('translate2')
  @UseInterceptors(TimeoutInterceptor)
  translateText2(@Body() translateDto: TranslateDto) {
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

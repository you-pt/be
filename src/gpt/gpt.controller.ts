import {
  Body,
  Controller,
  UseInterceptors,
  Post,
  UseGuards,
  Patch,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'auth/roles.guard';
import { GptService } from './gpt.service';
import { User } from 'src/entities/user.entity';
import {
  ProsConsDiscusserDto,
  ProcessImageAndManageDietDto,
  SaveResultDto,
  ReportMealDto,
} from './dtos';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { TimeoutInterceptor } from 'utils/timeout.intercepter';
import { UserInfo } from 'src/user/utils/userInfo.decorator';
import { Roles } from 'auth/roles.decorator';
import { Role } from '../user/types/userRole.type';

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
  public async imageToText(
    @Body() prosConsDiscusserDto: ProsConsDiscusserDto,
    @UserInfo() user: User,
  ) {
    return this.gptService.imageToText(prosConsDiscusserDto);
  }

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

  @ApiOperation({ summary: '로그인 한 유저에 대한 식단 평가 정보 저장' })
  @ApiBody({
    schema: {
      properties: {
        prompt: {
          type: 'string',
          example: 'this is good for you blahblah',
        },
      },
    },
  })
  @Post('saveMeal')
  @UseGuards(AuthGuard('jwt'))
  public async saveMealResult(
    @Body() saveResultDto: SaveResultDto,
    @UserInfo() user: User,
  ): Promise<any> {
    console.log(saveResultDto);
    const { reportAI } = saveResultDto;
    const savedMeal = await this.gptService.saveMealResult(user.id, reportAI);
    return { status: 'success', data: savedMeal };
  }

  @ApiOperation({ summary: '트레이너 유저의 식단 평가 작성' })
  @ApiBody({
    schema: {
      properties: {
        prompt: {
          type: 'string',
          example: 'this is good',
        },
      },
    },
  })
  @Patch('reportMeal/:mealId')
  @UseGuards(RolesGuard)
  @Roles(Role.Trainer)
  reportMeal(
    @Param('mealId', ParseIntPipe) mealId: number,
    @UserInfo() user: User,
    @Body() reportMealDto: ReportMealDto,
  ) {
    const newReport = reportMealDto.report;
    return this.gptService.updateMeal(mealId, newReport);
  }
}

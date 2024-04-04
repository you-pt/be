import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { DietService } from './diet.service';
import { CreateDietDto } from './dto/create-diet.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserInfo } from '../user/utils/userInfo.decorator';
import { User } from '../user/entities/user.entity';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('식단 관리 API')
@Controller('diet')
export class DietController {
  constructor(private readonly dietService: DietService) {}

  @ApiOperation({ summary: '식사 생성', description: '1끼 식사 메뉴 전송' })
  @ApiBody({
    schema: {
      properties: {
        menus: {
          type: 'array',
          example: [
            {
              name: '흰 쌀밥',
              kcal: 2000,
            },
            {
              name: '된장국',
              kcal: 1000,
            },
            {
              name: '계란 후라이',
              kcal: 1000,
            },
          ],
        },
      },
    },
  })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@UserInfo() user: User, @Body() createDietDto: CreateDietDto) {
    return this.dietService.create(+user.id, createDietDto);
  }

  @ApiOperation({summary: "식단 삭제"})
  @ApiParam({ name: "mealId", required: true, description: "number"})
  @Delete(':mealId')
  remove(@Param('mealId') mealId: string) {
    return this.dietService.remove(+mealId);
  }
}

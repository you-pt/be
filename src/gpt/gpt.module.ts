import { Module } from '@nestjs/common';
import { GptService } from './gpt.service';
import { GptController } from './gpt.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodItem } from 'src/entities/foodItem.entity';
import { User } from 'src/entities/user.entity';
import { Meal } from 'src/entities/meals.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([FoodItem, User, Meal]), HttpModule],
  controllers: [GptController],
  providers: [GptService],
})
export class GptModule {}

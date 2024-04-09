import { Module } from '@nestjs/common';
import { GptService } from './gpt.service';
import { GptController } from './gpt.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodItem } from 'src/entities/foodItem.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FoodItem])],
  controllers: [GptController],
  providers: [GptService],
})
export class GptModule {}

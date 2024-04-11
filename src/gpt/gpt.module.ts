import { Module } from '@nestjs/common';
import { GptService } from './gpt.service';
import { GptController } from './gpt.controller';
import { FoodItem } from 'src/entities/foodItem.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([FoodItem])],
  controllers: [GptController],
  providers: [GptService],
})
export class GptModule {}

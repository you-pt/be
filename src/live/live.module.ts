import { Module } from '@nestjs/common';
import { LiveController } from './live.controller';

@Module({
  imports: [],
  controllers: [LiveController],
})
export class LiveModule {}

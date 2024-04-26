import { Module } from '@nestjs/common';
import { RoomListService } from './room-list.service';

import { RedisService } from './redis/redis.provider';
import { RoomListController } from './room-list.controller';

@Module({
  controllers: [RoomListController],
  providers: [RoomListService, RedisService],
  exports: [RedisService, RoomListService],
})
export class RoomListModule {}

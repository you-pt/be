import { Module } from '@nestjs/common';
import { RoomListService } from './room-list.service';
import { RoomListGateway } from './room-list.gateway';
import { RedisService } from './redis/redis.provider';
import { RoomListController } from './room-list.controller';

@Module({
  controllers: [RoomListController],
  providers: [RoomListGateway, RoomListService, RedisService],
  exports: [RedisService, RoomListService],
})
export class RoomListModule {}

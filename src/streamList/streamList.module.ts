import { Module } from '@nestjs/common';
import { StreamListGateway } from './streamList.gateway';
import { ChatRoomService } from './streamList.service';
import { RoomListService } from 'src/room-list/room-list.service';
import { RoomListModule } from 'src/room-list/room-list.module';

@Module({
  providers: [StreamListGateway, ChatRoomService, RoomListService],
  imports: [RoomListModule],
})
export class StreamListModule {}

import { Module } from '@nestjs/common';
import { StreamListGateway } from './streamList.gateway';
import { ChatRoomService } from './streamList.service';

@Module({
  providers: [StreamListGateway, ChatRoomService],
})
export class EventsModule {}

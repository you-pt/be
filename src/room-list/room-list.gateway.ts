import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { RoomListService } from './room-list.service';
import { CreateRoomListDto } from './dto/create-room-list.dto';
import { UpdateRoomListDto } from './dto/update-room-list.dto';

@WebSocketGateway()
export class RoomListGateway {
  constructor(private readonly roomListService: RoomListService) {}

  @SubscribeMessage('createRoomList')
  create(@MessageBody() createRoomListDto: CreateRoomListDto) {
    return this.roomListService.create(createRoomListDto);
  }

  // @SubscribeMessage('findAllRoomList')
  // findAll() {
  //   return this.roomListService.findAll();
  // }

  // @SubscribeMessage('findOneRoomList')
  // findOne(@MessageBody() id: number) {
  //   return this.roomListService.findOne(id);
  // }

  // @SubscribeMessage('updateRoomList')
  // update(@MessageBody() updateRoomListDto: UpdateRoomListDto) {
  //   return this.roomListService.update(updateRoomListDto.id, updateRoomListDto);
  // }

  // @SubscribeMessage('removeRoomList')
  // remove(@MessageBody() id: number) {
  //   return this.roomListService.remove(id);
  // }
}

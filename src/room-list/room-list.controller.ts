import { Body, Controller, Get, Post } from '@nestjs/common';
import { RoomListService } from './room-list.service';
import { CreateRoomListDto } from './dto/create-room-list.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("방 목록 관리")
@Controller('room-list')
export class RoomListController {
  constructor(
    private readonly roomListService: RoomListService
  ){}

  @Post()
  async addRoomList(@Body() session: CreateRoomListDto){
    return await this.roomListService.create(session);
  }

  @Get()
  async findRoomList(){
    return await this.roomListService.findRoomList()
  }
}

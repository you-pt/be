import { PartialType } from '@nestjs/mapped-types';
import { CreateRoomListDto } from './create-room-list.dto';

export class UpdateRoomListDto extends PartialType(CreateRoomListDto) {
  id: number;
}

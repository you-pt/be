import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomListDto } from './dto/create-room-list.dto';
import { UpdateRoomListDto } from './dto/update-room-list.dto';
import { RedisService } from './redis/redis.provider';

@Injectable()
export class RoomListService {
  constructor(private readonly redisService: RedisService) {}

  async create(session: CreateRoomListDto) {
    const { sessionId, participant } = session;
    if (!sessionId || !participant) {
      throw new NotFoundException('데이터가 잘못되었습니다');
    }
    const newRoom = await this.redisService.client.sadd(sessionId, participant);
    return { message: '데이터를 저장했습니다.' };
  }

  async findRoomList() {
    const roomList: string[] = await this.redisService.client.keys('*');
    return Promise.all(roomList.map(async (roomName) => {
      const roomInfo: string[] = await this.redisService.client.smembers(roomName);
      const roomUserNumber: number = roomInfo.length
      return {sessionName: roomName, participantNumber: roomUserNumber}
    }, this));
  }

  async removeParticipant() {

  }
}

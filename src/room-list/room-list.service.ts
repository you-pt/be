import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomListDto } from './dto/create-room-list.dto';
import { UpdateRoomListDto } from './dto/update-room-list.dto';
import { RedisService } from './redis/redis.provider';
import { RoboMaker } from 'aws-sdk';

export interface createReturn {
  message: string;
}

export interface findRoomListReturn {
  sessionName: string;
  participantNumber: number;
}

export type findRoomParticipantsReturn = string[];

@Injectable()
export class RoomListService {
  constructor(private readonly redisService: RedisService) {}

  async create(room: CreateRoomListDto): Promise<createReturn> {
    const { sessionId, participant, subscribers } = room;
    if (!sessionId || !participant) {
      throw new NotFoundException('데이터가 잘못되었습니다');
    }
    const roomKey = `room:${sessionId}`;
    const newRoom = await this.redisService.client.sadd(roomKey, participant);
    return { message: '데이터를 저장했습니다.' };
  }

  async findRoomList(): Promise<findRoomListReturn[]> {
    const roomList: string[] = await this.redisService.client.keys('room:*');
    return Promise.all(
      roomList.map(async (roomName): Promise<findRoomListReturn> => {
        const roomParticipants: string[] =
          await this.findRoomParticipants(roomName);
        const roomUserNumber: number = roomParticipants.length;
        const sessionName: string = roomName.replace('room:', '');
        return { sessionName: sessionName, participantNumber: roomUserNumber };
      }, this),
    );
  }

  async findRoomParticipants(
    roomName: string,
  ): Promise<findRoomParticipantsReturn> {
    if (roomName === '' || !roomName) {
      throw new NotFoundException('방 제목을 입력해주세요.');
    }
    const roomParticipants = await this.redisService.client.smembers(roomName);
    return roomParticipants;
  }

  async deleteParticipant(roomName: string, participant: string) {
    if (!roomName || !participant) {
      throw new NotFoundException('존재하지 않는 방 또는 사용자입니다.');
    }
    await this.redisService.client.srem(roomName, participant);
    return { message: `${participant} 사용자가 방을 나갔습니다.` };
  }
}

import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Chat } from '../entities/chat.entity';
// import { User } from '../entities/user.entity';

// interface Chat {
//   id: number;
//   name: string;
//   text: string;
// }

@Injectable()
export class ChatService {
  // chats: Chat[] = [];
  // clientToUser = {}; // 메모리 내 개체를 사용하여 이를 다시 시뮬레이션한 in-memory 방식
  private chatRooms: { [roomId: string]: Chat[] } = {};
  private clientToRoom: { [clientId: string]: string } = {};
  private clientToUser: { [clientId: string]: string } = {};

  /** 그리고 아래와 같이 이러한 식별 요청을 각각 받을 때 생성할 작업은
   * 클라이언틑 ID에서 user 이름으로 mapping 한 걸 알수 있도록 해당 맵을 업데이트함.
   * 클라이언트 ID를 전달하는 user에게 this.client를 수행하고
   * 클라이언트 ID가 있는 조회를 수행 할 수 있는 이름으로 설정함.
   */
  identify(name: string, clientId: string) {
    this.clientToUser[clientId] = name;
    return Object.values(this.clientToUser); /**그리고 이 객체의 값을 반환함. 
    이걸로 현재 온라인에 접속해있는 사람이 누구인지 알아내는 방법도 구현해 낼 수 있음 */
  }

  /**이름으로 클라이언트를 가져올 수 있는 유틸리티 메소드 */
  getClientName(clientId: string) {
    return this.clientToUser[clientId];
  }

  /**채팅 칠때 이름도 같이 */
  create(creatChatDto: CreateChatDto, clientId: string) {
    const { roomId, text } = creatChatDto;
    const chat: Chat = {
      id: this.chatRooms[roomId]?.length + 1 || 1,
      name: this.clientToUser[clientId],
      text,
      roomId: '',
    };

    if (!this.chatRooms[roomId]) {
      this.chatRooms[roomId] = []; // 채팅방이 없으면 새로 생성
    }

    this.chatRooms[roomId].push(chat); // 해당 채팅방에 채팅 추가
    this.clientToRoom[clientId] = roomId; // 클라이언트가 참여한 채팅방 설정

    // this.chats.push(chat);

    return chat;
  }

  findAll(roomId: string) {
    return this.chatRooms[roomId] || []; // 해당 채팅방의 모든 채팅 반환
  }

  findClientRoom(clientId: string) {
    return this.clientToRoom[clientId]; // 클라이언트가 참여한 채팅방 반환
  }

  findRoomClients(roomId: string) {
    return Object.keys(this.clientToRoom).filter(
      (clientId) => this.clientToRoom[clientId] === roomId,
    ); // 특정 채팅방에 참여한 클라이언트 목록 반환
  }
  // findAll() {
  //   return this.chats;
  // }
}

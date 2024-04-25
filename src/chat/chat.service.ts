import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Chat } from '../entities/chat.entity';
// import { User } from '../entities/user.entity';

@Injectable()
export class ChatService {
  chats: Chat[] = [{ name: '사용자', text: '내용' }];
  clientToUser = {};

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
    const chat = {
      name: this.clientToUser[clientId],
      text: creatChatDto.text,
    };

    this.chats.push(chat);

    return chat;
  }

  findAll() {
    return this.chats;
  }
}

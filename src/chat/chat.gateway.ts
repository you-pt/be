import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Server, Socket } from 'socket.io';

/** 채팅 어플리케이션은 잠재적으로 1:1 작업을 수행함
 * 여기서 1:1 채팅일 수 도 있고, 다대 그룹 채팅일 수도 있다.
 */
@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('createMessage')
  async create(
    @MessageBody() createChatDto: CreateChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId, text } = createChatDto;
    const chat = await this.chatService.create(createChatDto, client.id);
    client.join(roomId); /**클라이언트를 채팅방에 조인함. */

    /**메세지를 해당 채팅방에 브로트캐스트함 */
    this.server.to(roomId).emit('message', chat);

    return chat;
  }

  /**예전 메시지 불러옴. */
  @SubscribeMessage('findAllMessages')
  findAll(@ConnectedSocket() client: Socket) {
    const roomId = this.chatService.findClientRoom(client.id);
    const messages = this.chatService.findAll(roomId);
    return messages;
  }

  /**채팅방에 참여한 사용자들이 누군지 식별가능 */
  @SubscribeMessage('join')
  joinRoom(
    @MessageBody('roomId') roomId: string,
    // @MessageBody('name') name: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(roomId); /**클라이언트 특정 채팅방에 조인함. */
    // return this.chatService.identify(name, client.id);
  }

  /**사용자가 입력중임이라고 브로드캐스트해주는 부분 (Boolean 타입) */
  @SubscribeMessage('typing')
  async typing(
    @MessageBody('roomId') roomId: string,
    @MessageBody('isTyping') isTyping: Boolean,
    @ConnectedSocket() client: Socket,
  ) {
    const name = await this.chatService.getClientName(client.id);

    /** 해당 채팅방에 타이핑 이벤트를 브로드캐스트함. */
    client.to(roomId).emit('typing', { name, isTyping });

    // client.broadcast.emit('typing', { name, isTyping });
  }
}

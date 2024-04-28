import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { setInitDTO } from './dto/setinit.dto';
import { ChatService } from './streamList.service';
import { RoomListService } from 'src/room-list/room-list.service';
import { CreateChatDto } from './dto/create-chat.dto';

@WebSocketGateway({
  path: '/back/',
  cors: {},
})
export class StreamListGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly chatService: ChatService,
    private readonly RoomListService: RoomListService,
  ) {}
  @WebSocketServer()
  server: Server;

  //소켓 연결시 유저목록에 추가
  public handleConnection(client: Socket): void {
    console.log('connected', client.id);
    client.leave(client.id);
    client.join('room:lobby');
  }

  //소켓 연결 해제시 유저목록에서 제거
  public handleDisconnect(client: Socket): void {
    console.log('disonnected', client.id);
  }

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
  findAll(
    @MessageBody('roomId') roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
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

  @SubscribeMessage('sessionUpdate')
  async handleGetSessionInfo(client: Socket): Promise<void> {
    try {
      const sessionInfo = await this.RoomListService.findRoomList();

      // 클라이언트에 세션 정보 전송
      client.emit('sessionInfo', sessionInfo);
    } catch (error) {
      console.error('Failed to retrieve session info from Redis:', error);
      client.emit('sessionInfo', null); // 에러 발생 시 클라이언트에 null 전송
    }
  }
}

import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { setInitDTO } from './dto/setinit.dto';
import { ChatRoomService } from './streamList.service';
import { RoomListService } from 'src/room-list/room-list.service';

@WebSocketGateway(5000, {
  cors: {},
})
export class StreamListGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly ChatRoomService: ChatRoomService,
    private readonly RoomListService: RoomListService,
  ) {}
  @WebSocketServer()
  server: Server;

  //소켓 연결시 유저목록에 추가
  public handleConnection(client: Socket): void {
    console.log('connected', client.id);
    client.leave(client.id);
    client.data.roomId = `room:lobby`;
    client.join('room:lobby');
  }

  //소켓 연결 해제시 유저목록에서 제거
  public handleDisconnect(client: Socket): void {
    const { roomId } = client.data;
    if (
      roomId != 'room:lobby' &&
      !this.server.sockets.adapter.rooms.get(roomId)
    ) {
      this.ChatRoomService.deleteChatRoom(roomId);
      this.server.emit(
        'getChatRoomList',
        this.ChatRoomService.getChatRoomList(),
      );
    }
    console.log('disonnected', client.id);
  }

  //메시지가 전송되면 모든 유저에게 메시지 전송
  @SubscribeMessage('sendMessage')
  sendMessage(client: Socket, message: string): void {
    client.rooms.forEach((roomId) =>
      client.to(roomId).emit('getMessage', {
        id: client.id,
        nickname: client.data.nickname,
        message,
      }),
    );
  }

  //처음 접속시 닉네임 등 최초 설정
  @SubscribeMessage('setInit')
  setInit(client: Socket, data: setInitDTO): setInitDTO {
    // 이미 최초 세팅이 되어있는 경우 패스
    if (client.data.isInit) {
      return;
    }

    client.data.nickname = data.nickname
      ? data.nickname
      : '낯선사람' + client.id;

    client.data.isInit = true;

    return {
      nickname: client.data.nickname,
    };
  }

  //닉네임 변경
  @SubscribeMessage('setNickname')
  setNickname(client: Socket, nickname: string): void {
    const { roomId } = client.data;
    client.to(roomId).emit('getMessage', {
      id: null,
      nickname: '안내',
      message: `"${client.data.nickname}"님이 "${nickname}"으로 닉네임을 변경하셨습니다.`,
    });
    client.data.nickname = nickname;
  }

  //채팅방 목록 가져오기
  @SubscribeMessage('getChatRoomList')
  getChatRoomList(client: Socket, payload: any) {
    client.emit('getChatRoomList', this.ChatRoomService.getChatRoomList());
  }

  //채팅방 생성하기
  @SubscribeMessage('createChatRoom')
  createChatRoom(client: Socket, roomName: string) {
    this.ChatRoomService.createChatRoom(client, roomName);
    return {
      sessionId: client.data.roomId,
      participantsNumber: this.ChatRoomService.getChatRoom(client.data.roomId)
        .participantsNumber,
    };
  }

  //채팅방 들어가기
  @SubscribeMessage('enterChatRoom')
  enterChatRoom(client: Socket, roomId: string) {
    //이미 접속해있는 방 일 경우 재접속 차단
    if (client.rooms.has(roomId)) {
      return;
    }
    this.ChatRoomService.enterChatRoom(client, roomId);
    return {
      roomId: roomId,
      roomName: this.ChatRoomService.getChatRoom(roomId).sessionId,
    };
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

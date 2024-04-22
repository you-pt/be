interface Publisher {}
interface subscriber {}

export class CreateRoomListDto {
  sessionId: string;
  participant: string;
  subscribers: string[]
}

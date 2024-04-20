import { Test, TestingModule } from '@nestjs/testing';
import { RoomListService } from './room-list.service';

const mockCreateRoomListDTO = {}

const mockSession = {
  sessionName: "sessionA",
  publisher: "user1",
}

describe('RoomListService', () => {
  let service: RoomListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomListService],
    }).compile();

    service = module.get<RoomListService>(RoomListService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  test('예제 데이터가 잘 들어가는가', () => {

  })
});

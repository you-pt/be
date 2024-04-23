import { Test, TestingModule } from '@nestjs/testing';
import { RoomListGateway } from './room-list.gateway';
import { RoomListService } from './room-list.service';

describe('RoomListGateway', () => {
  let gateway: RoomListGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomListGateway, RoomListService],
    }).compile();

    gateway = module.get<RoomListGateway>(RoomListGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { RoomListController } from './room-list.controller';

describe('RoomListController', () => {
  let controller: RoomListController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomListController],
    }).compile();

    controller = module.get<RoomListController>(RoomListController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

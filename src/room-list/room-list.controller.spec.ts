import { Test, TestingModule } from '@nestjs/testing';
import { RoomListController } from './room-list.controller';
import { RoomListService } from './room-list.service';

const mockService = {
  create: jest.fn().mockResolvedValue({ message: '데이터를 저장했습니다.' }),
  findRoomList: jest.fn().mockResolvedValue([
    {
      sessionName: 'sessionA',
      participantNumber: 3,
    },
    {
      sessionName: 'sessionB',
      participantNumber: 3,
    },
  ]),
  findRoomParticipants: jest
    .fn()
    .mockResolvedValue(['user1', 'user2', 'user3']),
  deleteParticipant: jest.fn(async (roomName, participant) => {
    return { message: `${participant} 사용자가 방을 나갔습니다.` };
  }),
};

const mockData = {
  addRoomList: {
    source: {
      sessionId: 'sessionA',
      participant: 'user1',
      subscribers: ['user2', 'user3'],
    },
    result: {
      message: '데이터를 저장했습니다.',
    },
  },
  findRoomList: {
    source: {},
    result: {},
  },
  deleteRoomParticipant: {
    source: {},
    result: {},
  },
};

describe('RoomListController', () => {
  let controller: RoomListController;
  let service: RoomListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomListController],
      providers: [
        {
          provide: RoomListService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<RoomListController>(RoomListController);
    service = module.get<RoomListService>(RoomListService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  test('addRoomList', async () => {
    const result = await controller.addRoomList(mockData.addRoomList.source);

    expect(service.create).toHaveBeenCalled();
    expect(service.create).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockData.addRoomList.result);
  });

  test("addRoomList", async () => {
    jest.spyOn(service, "create")

    expect(() => service.create({
      sessionId: '',
      participant: '',
      subscribers: []
    })).rejects.toThrow()
  })
});

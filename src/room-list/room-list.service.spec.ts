import { Test, TestingModule } from '@nestjs/testing';
import { RoomListService } from './room-list.service';
import { RedisService } from './redis/redis.provider';
import { ConfigService } from '@nestjs/config';
import { CreateRoomListDto } from './dto/create-room-list.dto';
import { NotFoundException } from '@nestjs/common';

const mockRedisService = {
  client: {
    sadd: jest.fn().mockResolvedValue(1),
    smembers: jest.fn().mockResolvedValue(['user1', 'user2', 'user3']),
    keys: jest.fn().mockResolvedValue(['sessionA', 'sessionB']),
    srem: jest.fn().mockResolvedValue(1),
  },
};

const mockConfigService = {
  get: jest.fn((key: string) => {
    switch (key) {
      case 'REDIS_HOST':
        return 'localhost';
      case 'REDIS_PORT':
        return 5678;
      case 'REDIS_PASSWORD':
        return 'redispassword';
      default:
        return null;
    }
  }),
};

const mockCreateRoomListDTO = {};

const mockData = {
  roomListService: {
    create: {
      source: { sessionId: 'sessionA', participant: 'user1', subscribers: [] },
      result: { message: '데이터를 저장했습니다.' },
    },
    findRoomList: {
      source: {},
      result: [
        { sessionName: 'sessionA', participantNumber: 3 },
        { sessionName: 'sessionB', participantNumber: 3 },
      ],
    },
    findRoomParticipants: {
      source: {
        roomName: 'sessionA',
      },
      result: ['user1', 'user2', 'user3'],
    },
    deleteParticipant: {
      source: {
        roomName: 'sessionA',
        participant: 'user1',
      },
      result: { message: 'user1 사용자가 방을 나갔습니다.' },
    },
  },
  redisService: {
    client: {
      sadd: {
        source: {
          sessionId: 'user1',
          participant: 'user2',
        },
      },
      smembers: {},
      key: {},
      srem: {},
    },
  },
};

describe('RoomListService', () => {
  let roomListService: RoomListService;
  let redisService: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomListService,
        { provide: RedisService, useValue: mockRedisService },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    roomListService = module.get<RoomListService>(RoomListService);
    redisService = module.get<RedisService>(RedisService);
  });

  it('should be defined', () => {
    expect(roomListService).toBeDefined();
    expect(redisService).toBeDefined();
    expect(redisService).toHaveProperty('client');
  });

  test('create', async () => {
    jest.spyOn(redisService.client, "sadd").mockResolvedValue(1)
    const result = await roomListService.create(
      mockData.roomListService.create.source,
    );

    expect(redisService.client.sadd).toHaveBeenCalledTimes(1)
    expect(result).toHaveProperty('message');
  });

  test('create-[Error]', async () => {
    expect(() =>
      roomListService.create({
        sessionId: 'user1',
        participant: '',
        subscribers: [],
      }),
    ).rejects.toThrow();
    expect(() =>
      roomListService.create({
        sessionId: '',
        participant: 'user2',
        subscribers: [],
      }),
    ).rejects.toThrow();
  });

  test('findRoomList', async () => {
    const result = await roomListService.findRoomList();

    expect(redisService.client.keys).toHaveBeenCalled()
    expect(result).toEqual(mockData.roomListService.findRoomList.result);
    expect(result).toHaveLength(2);
  });

  test('findRoomParticipants', async () => {
    jest
      .spyOn(roomListService, 'findRoomParticipants')
      .mockImplementation(
        async () => mockData.roomListService.findRoomParticipants.result,
      );
    const result = await roomListService.findRoomParticipants('sessionA');
    expect(roomListService.findRoomParticipants).toHaveBeenCalled();
    expect(result).toBe(mockData.roomListService.findRoomParticipants.result);
    expect(result).toHaveLength(3);
  });

  test('findRoomParticipants-[Error]', async () => {
    expect(() => roomListService.findRoomParticipants('')).rejects.toThrow();
  });

  test('deleteParticipant', async () => {
    const { roomName, participant } =
      mockData.roomListService.deleteParticipant.source;
    const result = await roomListService.deleteParticipant(
      roomName,
      participant,
    );

    expect(redisService.client.srem).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockData.roomListService.deleteParticipant.result);
  });

  test('deleteParticipant-[Error]', async () => {
    expect(() => roomListService.deleteParticipant('', '')).rejects.toThrow();
    expect(() =>
      roomListService.deleteParticipant('sessionA', ''),
    ).rejects.toThrow();
    expect(() =>
      roomListService.deleteParticipant('', 'user1'),
    ).rejects.toThrow();
  });
});

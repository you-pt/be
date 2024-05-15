import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';
import { Schedule } from '../entities/schedules.entity';
import { User } from '../entities/user.entity';
import { TrainerInfo } from '../entities/trainerInfo.entity';
import { Gender } from '../user/types/gender.type';
import { Role } from '../user/types/userRole.type';

const mockScheduleService = {
  create: jest.fn(),
  findAllMySchedule: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}

const createScheduleDto = {
  ptDate: '2024-04-15',
  ptTime: '18:00',
  content: 'mockContent',
  userId: 1,
}

const updateScheduleDto = {
  ptDate: '2024-04-20',
  ptTime: '18:00',
  content: 'mockContent2',
}

const mockUser: User = {
  id: 1,
  email: 'user123',
  nickname: 'KimName',
  password: '',
  name: '',
  gender: Gender.Male,
  phone: '',
  birth: '',
  role: Role.User,
  createdAt: undefined,
  updatedAt: undefined,
  meals: [],
  messages: [],
  schedules: [],
  trainerInfo: new TrainerInfo
}

describe('ScheduleController', () => {
  let scheduleController: ScheduleController;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScheduleController],
      providers: [
        {
          provide: ScheduleService,
          useValue: mockScheduleService,
        },
        Schedule
      ],
    }).compile();

    scheduleController = module.get<ScheduleController>(ScheduleController);
  });

  it('should be defined', () => {
    expect(scheduleController).toBeDefined();
  });

  describe('create', () => {
    it('스케줄 생성 성공', async () => {
      mockScheduleService.create.mockResolvedValue({ message: '일정 생성 완료!' });
      expect(await scheduleController.create(createScheduleDto, mockUser)).toEqual({ message: '일정 생성 완료!' });
      expect(mockScheduleService.create).toHaveBeenCalledTimes(1);
      expect(mockScheduleService.create).toHaveBeenCalledWith(createScheduleDto, mockUser.id);
    })
  });

  describe('findAllMySchedule', () => {
    it('스케줄 조회 성공', async () => {
      const mockSchedules = [
        {
          scheduleId: 1,
          ...createScheduleDto,
          trainerId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          scheduleId: 2,
          ...createScheduleDto,
          trainerId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      mockScheduleService.findAllMySchedule.mockResolvedValue(mockSchedules);
      expect(await scheduleController.findAllMySchedule(mockUser)).toEqual(mockSchedules);
      expect(mockScheduleService.findAllMySchedule).toHaveBeenCalledTimes(1);
      expect(mockScheduleService.findAllMySchedule).toHaveBeenCalledWith(mockUser.id);
    })
  });

  describe('findOne', () => {
    it('스케줄 상세 조회 성공', async () => {
      const mockSchedule = {
        scheduleId: 1,
        ...createScheduleDto,
        trainerId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockScheduleService.findOne.mockResolvedValue(mockSchedule);
      expect(await scheduleController.findOne(mockSchedule.scheduleId, mockUser)).toEqual(mockSchedule);
      expect(mockScheduleService.findOne).toHaveBeenCalledTimes(1);
      expect(mockScheduleService.findOne).toHaveBeenCalledWith(mockSchedule.scheduleId, mockUser.id);
    })
  });

  describe('update', () => {
    it('스케줄 변경 성공', async () => {
      const mockSchedule = {
        scheduleId: 1,
        ...createScheduleDto,
        trainerId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      mockScheduleService.update.mockResolvedValue(mockSchedule);
      expect(await scheduleController.update(mockSchedule.scheduleId, updateScheduleDto, mockUser)).toEqual(mockSchedule);
      expect(mockScheduleService.update).toHaveBeenCalledTimes(1);
      expect(mockScheduleService.update).toHaveBeenCalledWith(mockSchedule.scheduleId, updateScheduleDto, mockUser.id);
    })
  });

  describe('remove', () => {
    it('스케줄 삭제 성공', async () => {
      const mockSchedule = {
        scheduleId: 1,
        ...createScheduleDto,
        trainerId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      mockScheduleService.remove.mockResolvedValue(mockSchedule);
      expect(await scheduleController.remove(mockSchedule.scheduleId, mockUser)).toEqual(mockSchedule);
      expect(mockScheduleService.remove).toHaveBeenCalledTimes(1);
      expect(mockScheduleService.remove).toHaveBeenCalledWith(mockSchedule.scheduleId, mockUser.id);
    });
  });
});

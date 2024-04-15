import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleService } from './schedule.service';
import { Repository } from 'typeorm';
import { Schedule } from '../entities/schedules.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('ScheduleService', () => {
  let scheduleService: ScheduleService;
  let scheduleRepositoryMock: Partial<Record<keyof Repository<Schedule>, jest.Mock>>;

  const createScheduleDto = {
    ptDate: '2030-04-15',
    ptTime: '18:00',
    content: 'mockContent',
    userId: 1,
  }

  const updateScheduleDto = {
    ptDate: '2024-04-20',
    ptTime: '18:00',
    content: 'mockContent2',
  }

  beforeEach(async () => {
    scheduleRepositoryMock = {
      save: jest.fn(),
      findBy: jest.fn(),
      findOneBy: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScheduleService,
        {
          provide: getRepositoryToken(Schedule),
          useValue: scheduleRepositoryMock,
        },
      ],
    }).compile();

    scheduleService = module.get<ScheduleService>(ScheduleService);
  });

  it('should be defined', () => {
    expect(scheduleService).toBeDefined();
  });

  describe('스케줄 생성', () => {
    it('스케줄 생성 성공', async () => {
      const mockDto = { ...createScheduleDto, trainerId: 1 };
      scheduleRepositoryMock.save.mockResolvedValue(mockDto);
      await scheduleService.create(createScheduleDto, mockDto.trainerId);
      expect(scheduleRepositoryMock.save).toHaveBeenCalledWith(mockDto);
      expect(await scheduleService.create(createScheduleDto, mockDto.trainerId)).toEqual({ message: '일정 생성 완료!' });
    });

    it('과거 날짜 입력', async () => {
      const trainerId = 1;
      const { ptDate, ...other } = createScheduleDto;
      const otherCreateDto = { ...other, ptDate: '2020-01-01' };
      await expect(scheduleService.create(otherCreateDto, trainerId))
        .rejects
        .toThrow(new BadRequestException('과거 날짜는 불가능합니다.'))
    })
  })

  describe('본인 스케줄 조회', () => {
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
      scheduleRepositoryMock.findBy.mockResolvedValue(mockSchedules);
      await scheduleService.findAllMySchedule(createScheduleDto.userId);
      expect(scheduleRepositoryMock.findBy).toHaveBeenCalledWith({ userId: createScheduleDto.userId });
      expect(await scheduleService.findAllMySchedule(createScheduleDto.userId)).toEqual(mockSchedules);
    })
  });

  describe('스케줄 상세 조회', () => {
    it('스케줄 상세 조회 성공', async () => {
      const scheduleId = 1;
      const mockSchedule = {
        scheduleId,
        ...createScheduleDto,
        trainerId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      scheduleRepositoryMock.findOneBy.mockResolvedValue(mockSchedule);
      await scheduleService.findOne(scheduleId, createScheduleDto.userId);
      expect(scheduleRepositoryMock.findOneBy).toHaveBeenCalledWith({ scheduleId: scheduleId });
      expect(await scheduleService.findOne(scheduleId, createScheduleDto.userId)).toEqual(mockSchedule);
    })

    it('스케줄 상세 조회 실패 - 유저 불일치', async () => {
      const scheduleId = 1;
      const mockSchedule = {
        scheduleId,
        ...createScheduleDto,
        trainerId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      scheduleRepositoryMock.findOneBy.mockResolvedValue(mockSchedule);
      await expect(scheduleService.findOne(scheduleId, 3)).rejects.toThrow(new UnauthorizedException('본인의 스케줄만 열람할 수 있습니다.'));
    })
  });

  describe('스케줄 변경', () => {
    it('스케줄 변경 성공', async () => {
      const scheduleId = 1;
      const mockSchedule = {
        scheduleId,
        ...createScheduleDto,
        trainerId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      const mockSchedule2 = {
        scheduleId,
        ...updateScheduleDto,
        trainerId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      scheduleRepositoryMock.update.mockResolvedValue(mockSchedule2);
      scheduleRepositoryMock.findOneBy.mockResolvedValue(mockSchedule);
      await scheduleService.update(scheduleId, updateScheduleDto, createScheduleDto.userId);
      expect(scheduleRepositoryMock.update).toHaveBeenCalledWith({scheduleId: scheduleId}, updateScheduleDto);
      expect(await scheduleService.update(scheduleId, updateScheduleDto, createScheduleDto.userId)).toEqual({message: '일정 업데이트 완료!'});
    })
  });

  describe('스케줄 삭제', () => {
    it('스케줄 삭제 성공', async () => {
      const scheduleId = 1;
      const mockSchedule = {
        scheduleId,
        ...createScheduleDto,
        trainerId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      scheduleRepositoryMock.findOneBy.mockResolvedValue(mockSchedule);
      scheduleRepositoryMock.delete.mockResolvedValue(mockSchedule);
      await scheduleService.remove(scheduleId, createScheduleDto.userId);
      expect(scheduleRepositoryMock.delete).toHaveBeenCalledWith({scheduleId: scheduleId});
      expect(await scheduleService.remove(scheduleId, createScheduleDto.userId)).toEqual({message: '일정 삭제 완료!'});
    })
  });
});

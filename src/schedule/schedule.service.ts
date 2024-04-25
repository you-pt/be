import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from '../entities/schedules.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>
  ) { }
  
  async create(createScheduleDto: CreateScheduleDto, trainerId: number) {
    if(new Date(createScheduleDto.ptDate) < new Date()) {
      throw new BadRequestException('과거 날짜는 불가능합니다.')
    }
    await this.scheduleRepository.save({
      ...createScheduleDto,
      trainerId
    })
    return {message: '일정 생성 완료!'};
  }

  async findAllMySchedule(userId: number) {
    return await this.scheduleRepository.findBy({userId});;
  }

  async findOne(scheduleId: number, userId: number) {
    const schedule = await this.scheduleRepository.findOneBy({scheduleId});
    if(schedule.userId !== userId && schedule.trainerId !== userId)
      throw new UnauthorizedException('본인의 스케줄만 열람할 수 있습니다.');
    return schedule;
  }

  async update(scheduleId: number, updateScheduleDto: UpdateScheduleDto, userId: number) {
    await this.findOne(scheduleId, userId);
    await this.scheduleRepository.update({scheduleId}, {...updateScheduleDto})
    return {message: '일정 업데이트 완료!'};
  }

  async remove(scheduleId: number, userId: number) {
    await this.findOne(scheduleId, userId);
    await this.scheduleRepository.delete({scheduleId})
    return {message: '일정 삭제 완료!'};
  }
}

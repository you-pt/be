import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from '../entities/schedules.entity';
import { Repository } from 'typeorm';
import { MessageService } from '../message/message.service';
import { UserService } from '../user/user.service';
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    @Inject(MessageService)
    private readonly messageService: MessageService,
    @Inject(UserService)
    private readonly userService: UserService,
  ) { }
  
  async create(createScheduleDto: CreateScheduleDto, trainerId: number) {
    let now = new Date();
    now.setHours(now.getHours() + 9)
    // if(new Date(createScheduleDto.ptDate) < now) {
    //   throw new BadRequestException('과거 날짜는 불가능합니다.')
    // }
    const cronJobId = uuidv4();
    await this.scheduleRepository.save({
      ptTime : new Date(`${createScheduleDto.ptDate}T${createScheduleDto.ptTime}`),
      content: createScheduleDto.content,
      userId: createScheduleDto.userId,
      trainerId,
      cronJobId
    })

    const user = await this.userService.findOne(createScheduleDto.userId);

    let dateStr = createScheduleDto.ptDate + 'T' + createScheduleDto.ptTime;
    let date = new Date(dateStr);
    date.setMinutes(date.getMinutes() - 10);
    
    await this.messageService.fcm(
      `${user.token}`, '일정 생성 완료!', 
      `날짜 : ${new Date(dateStr).toLocaleString()}`
    )

    await this.messageService.addCronJob(
      `${user.token}`, 'PT를 준비해주세요! 10분 뒤 시작합니다!',
      `날짜 : ${new Date(dateStr).toLocaleString()}`,
      date, cronJobId
    )

    return {message: '일정 생성 완료!'};
  }

  async findAllMySchedule(userId: number) {
    return await this.scheduleRepository.findBy({userId});;
  }

  async findOne(scheduleId: number, userId: number) {
    const schedule = await this.scheduleRepository.findOneBy({scheduleId});
    if(!schedule)
      throw new NotFoundException('스케줄이 존재하지 않습니다.');
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

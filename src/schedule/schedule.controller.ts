import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { Role } from '../user/types/userRole.type';
import { UserInfo } from '../user/utils/userInfo.decorator';
import { User } from '../entities/user.entity';

@UseGuards(AuthGuard('jwt'))
@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.Trainer)
  @Post()
  create(@Body() createScheduleDto: CreateScheduleDto, @UserInfo() user: User) {
    return this.scheduleService.create(createScheduleDto, user.id);
  }

  @Get()
  findAllMySchedule(@UserInfo() user: User) {
    return this.scheduleService.findAllMySchedule(user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') scheduleId: number, @UserInfo() user: User) {
    return this.scheduleService.findOne(scheduleId, user.id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Trainer)
  @Patch(':id')
  update(@Param('id') scheduleId: number, @Body() updateScheduleDto: UpdateScheduleDto, @UserInfo() user: User) {
    return this.scheduleService.update(scheduleId, updateScheduleDto, user.id);
  }

  @Roles(Role.Trainer)
  @Delete(':id')
  remove(@Param('id') scheduleId: number, @UserInfo() user: User) {
    return this.scheduleService.remove(scheduleId, user.id);
  }
}

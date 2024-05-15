import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from '../entities/schedules.entity';
import { MessageModule } from '../message/message.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Schedule]),
    MessageModule,
    UserModule
  ],
  controllers: [ScheduleController],
  providers: [ScheduleService],
  exports: [ScheduleService]
})
export class SchedulesModule {}

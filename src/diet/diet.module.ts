import { Module } from '@nestjs/common';
import { DietService } from './diet.service';
import { DietController } from './diet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meal } from '../entities/meals.entity';
import { Menu } from '../entities/menus.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Meal, Menu, User]),
  ],
  controllers: [DietController],
  providers: [DietService],
})
export class DietModule {}

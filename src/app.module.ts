import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WinstonModule } from 'nest-winston';
import { UserModule } from './user/user.module';
import winston from 'winston';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { User } from './user/entities/user.entity';
import Joi from 'joi';
import { AuthModule } from 'auth/auth.module';


const typeOrmModuleOptions = {
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => ({
    namingStrategy: new SnakeNamingStrategy(),
    type: 'mysql',
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    database: configService.get('DB_NAME'),
    entities: [User], // 엔티티는 반드시 여기에 명시!
    synchronize: configService.get('DB_SYNC'),
    logging: true,
  }),
  inject: [ConfigService],
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_SECRET_KEY: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_NAME: Joi.string().required(),
        DB_SYNC: Joi.boolean().required(),
      }),
    }),
    WinstonModule.forRoot({
      level: 'info',
      format: winston.format.json(),
      defaultMeta: { service: 'fluentd' },
      transports: [
        new winston.transports.Console(),
        new winston.transports.Http({
          host: 'fluentd', // Fluentd 컨테이너의 호스트명
          port: 24224, // Fluentd 컨테이너의 포트
          path: '/', // Fluentd 엔드포인트 경로
        }),
      ],
    }), 
    UserModule,
    AuthModule,
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

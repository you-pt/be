import { ConsoleLogger, Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GptModule } from './gpt/gpt.module';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import Joi from 'joi';
import { AuthModule } from 'auth/auth.module';
import {
  FluentLogger,
  FluentConnection,
} from '@dynatech-corp/nestjs-fluentd-logger';

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
    entities: [__dirname + '/**/*.entity.{js,ts}'], // 엔티티는 반드시 여기에 명시!
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
    UserModule,
    GptModule,
    AuthModule,
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    FluentConnection,
    {
      provide: FluentConnection,
      useFactory: (config: ConfigService) => {
        return new FluentConnection({
          prefix: config.get<string>('LOGS_PROJECT'),
          connection: {
            socket: {
              host: config.get<string>('LOGS_HOST'),
              port: config.get<number>('LOGS_PORT'),
              timeout: config.get<number>('LOGS_TIMEOUT'),
            },
          },
        });
      },
      inject: [ConfigService],
    },
    FluentLogger,
    {
      provide: Logger,
      useFactory: (config: ConfigService, fluent: FluentConnection) => {
        // get LOGS_OUTPUT variable value
        const output = config.get<string>('LOGS_OUTPUT');
        // create NestJS ConsoleLogger for development (console)
        if (output === 'console') {
          return new ConsoleLogger(undefined, { timestamp: true });
        }
        // create FluentLogger instance for staging / production
        if (output === 'fluent') {
          return new FluentLogger(fluent);
        }
        // throw error when the variable is not Configured
        throw new Error('LOGS_OUTPUT should be console|fluent');
      },
      // inject ConfigService - for configuration values
      // inject FluentConnection - for when FluentLogger is instantiated
      inject: [ConfigService, FluentConnection],
    },
  ],
})
export class AppModule {}

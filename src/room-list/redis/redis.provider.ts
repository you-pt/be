import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private redisClient: Redis;
  constructor(
    private readonly configService: ConfigService,
  ) {
    this.redisClient = new Redis({
      host: this.configService.get<string>("REDIS_HOST"),
      port: this.configService.get<number>("REDIS_PORT"),
      password: this.configService.get<string>("REDIS_PASSWORD"),
    });
  }
  onModuleInit() {
    this.redisClient.on('connect', () => {
      console.log('Connected to Redis');
    });
  }
  onModuleDestroy() {
    this.redisClient.disconnect();
  }
  get client(): Redis {
    return this.redisClient;
  }
}
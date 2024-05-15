import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { winstonLogger } from '../utils/winston.config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

//웹소켓
import { join } from 'path';

import { SocketIoAdapter } from '../adapters/socket-io.adapter';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    //<-- NestExpressApplication은 ejs확인 위해 추가
    logger: winstonLogger,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.enableCors({
    origin: [
      process.env.BASE_URL,
      'http://localhost:3000',
      'http://127.0.0.1:3000',
    ],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('YOU-PT API')
    .setDescription('YOU-PT API 테스트 입니다.')
    .setVersion('1.0')
    .addTag('pt')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  //웹소켓
  app.useWebSocketAdapter(new SocketIoAdapter(app));

  await app.listen(3001);
}
bootstrap();

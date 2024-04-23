import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { winstonLogger } from '../utils/winston.config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

//웹소켓
import { join } from 'path';
import { WsAdapter } from '@nestjs/platform-ws';
import { SocketIoAdapter } from 'adapters/socket-io.adapter';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    //<-- NestExpressApplication은 ejs확인 위해 추가
    logger: winstonLogger,
    cors: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.enableCors();
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
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

  await app.listen(3001);
}
bootstrap();

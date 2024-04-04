import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { FluentLogger } from '@dynatech-corp/nestjs-fluentd-logger';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule, {
    bufferLogs: true
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.useLogger(await app.resolve(Logger));
  // flush logs after we setup the logger
  app.flushLogs();
  const config = new DocumentBuilder()
    .setTitle('YOU-PT API')
    .setDescription('YOU-PT API 테스트 입니다.')
    .setVersion('1.0')
    .addTag('pt')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3001);
}
bootstrap();

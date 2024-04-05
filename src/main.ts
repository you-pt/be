import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.useLogger(await app.resolve(Logger));
  // flush logs after we setup the logger
  app.flushLogs();
  app.enableCors();
  await app.listen(3001);
}
bootstrap();

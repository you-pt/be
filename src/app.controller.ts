import { Controller, Get, Logger, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  private readonly logger = new Logger(AppController.name);

  @Get()
  getHello(): string {
    this.logger.log('Log "Hello, world!" message');
    return this.appService.getHello();
  }

  @Get('ejs')
  @Render('index')
  root() {
    return { message: 'Hello world!' };
  }
}

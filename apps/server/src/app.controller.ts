import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Get('/hello-world')
  getHelloWorld() {
    this.logger.log('Hello World has been hit!');
    return { message: this.appService.helloWorld() };
  }
}

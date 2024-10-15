import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EnvService } from './env/env.service';
import { HueService } from './hue/hue.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly envService: EnvService,
    private readonly hueService: HueService,
  ) {}

  @Get()
  getHello() {
    return this.hueService.turnOffLight();
  }
}

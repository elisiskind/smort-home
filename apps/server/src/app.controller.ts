import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { EnvService } from './env/env.service';
import { HueService } from './hue/hue.service';

interface LightStatus {
  on: boolean;
}

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly envService: EnvService,
    private readonly hueService: HueService,
  ) {}

  @Get('light')
  getLights() {
    return this.hueService.getLights();
  }

  @Post('light/:id')
  updateLight(@Param('id') id: string, @Body() lightStatus: LightStatus) {
    return this.hueService.setLight(id, lightStatus.on);
  }
}

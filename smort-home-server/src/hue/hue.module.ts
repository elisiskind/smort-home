import { Module } from '@nestjs/common';
import { HueService } from './hue.service';
import { EnvModule } from '../env/env.module';
import { HueClient } from './hue.client';

@Module({
  imports: [EnvModule],
  providers: [HueService, HueClient],
  exports: [HueService],
})
export class HueModule {}

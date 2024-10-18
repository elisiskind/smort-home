import { Module } from '@nestjs/common';
import { HueService } from './hue.service';
import { EnvModule } from '../env/env.module';

@Module({
  imports: [EnvModule],
  providers: [HueService],
  exports: [HueService],
})
export class HueModule {}

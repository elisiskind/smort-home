import { Module } from '@nestjs/common';
import { ArduinoService } from './arduino.service';
import { HttpModule } from '@nestjs/axios';
import { EnvModule } from '../env/env.module';

@Module({
  imports: [HttpModule, EnvModule],
  providers: [ArduinoService],
  exports: [ArduinoService],
})
export class ArduinoModule {}

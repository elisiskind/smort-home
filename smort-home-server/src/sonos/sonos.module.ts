import { Module } from '@nestjs/common';
import { SonosService } from './sonos.service';

@Module({
  providers: [SonosService],
  exports: [SonosService],
})
export class SonosModule {}

import { Module } from '@nestjs/common';
import { HueService } from './hue.service';
import { EnvModule } from '../env/env.module';
import { HueLightService } from './services/hue.light.service';
import { HueRequestService } from './services/hue.request.service';
import { HueAlarmService } from './services/hue.alarm.service';
import { HueEventsService } from './services/hue.events.service';
import { HueRoomService } from './services/hue.room.service';
import { discoverBridge } from './hue.bridge.factory';

@Module({
  imports: [EnvModule],
  providers: [
    HueService,
    {
      provide: 'HUE_BRIDGE_METADATA',
      useFactory: discoverBridge,
    },
    HueLightService,
    HueRequestService,
    HueAlarmService,
    HueEventsService,
    HueRoomService,
  ],
  exports: [HueService],
})
export class HueModule {}

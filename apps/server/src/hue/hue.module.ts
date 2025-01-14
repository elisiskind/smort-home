import { Module } from '@nestjs/common';
import { HueService } from './hue.service';
import { EnvModule } from '../env/env.module';
import { discoverBridge } from './hueBridgeDiscovery';

@Module({
  imports: [EnvModule],
  providers: [
    HueService,
    {
      provide: 'HUE_BRIDGE_METADATA',
      useFactory: discoverBridge,
    },
  ],
  exports: [HueService],
})
export class HueModule {}

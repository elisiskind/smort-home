import { Injectable } from '@nestjs/common';
import { behaviorsSchema } from '../schemas/hue.alarm.schema';
import { HueRequestService } from './hue.request.service';

@Injectable()
export class HueAlarmService {
  constructor(readonly requestService: HueRequestService) {}

  async getAlarms() {
    const response = await this.requestService.request(
      'resource/behavior_instance',
    );
    return behaviorsSchema.parse(response);
  }
}

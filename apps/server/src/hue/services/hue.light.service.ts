import { Injectable, Logger } from '@nestjs/common';
import { HueLightUpdate, lightsSchema } from '../schemas/hue.light.schema';
import { HueRequestService } from './hue.request.service';
import { LightUpdate } from '@smort-home/firestore';

const transformLightUpdate = (
  id: string,
  update: LightUpdate,
): HueLightUpdate => ({
  id,
  on: update.on !== undefined ? { on: update.on } : undefined,
  dimming: update.dimming ?? undefined,
  color_temperature: update.colorTemperature
    ? { mirek: update.colorTemperature.value }
    : undefined,
});

@Injectable()
export class HueLightService {
  constructor(private readonly requestService: HueRequestService) {}

  async getLights() {
    const response = await this.requestService.request('resource/light');
    return lightsSchema.parse(response);
  }

  async setLight(id: string, update: LightUpdate) {
    return this.requestService.request(`resource/light/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transformLightUpdate(id, update)),
    });
  }
}

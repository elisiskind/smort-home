import { Injectable } from '@nestjs/common';
import { HueClient } from './hue.client';

@Injectable()
export class HueService {
  constructor(private readonly hueClient: HueClient) {}

  async listAll() {
    return this.hueClient.getLights();
  }

  async turnOffLight() {
    const lights = await this.listAll();
    const livingRoomLights = lights.filter((light) =>
      ['Twinkle Lights', 'Table Lamp', 'Standing Lamp'].includes(light.name),
    );
    livingRoomLights.forEach((light) => {
      this.hueClient.setLight(light.id, !light.on);
    });
  }
}

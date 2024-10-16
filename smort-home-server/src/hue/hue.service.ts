import { Injectable } from '@nestjs/common';
import { HueClient } from './hue.client';

@Injectable()
export class HueService {
  constructor(private readonly hueClient: HueClient) {
    this.subscribe();
  }

  async getLights() {
    return this.hueClient.getLights();
  }

  async updateLight(id: string, on: boolean) {
    await this.hueClient.setLight(id, on);
  }

  subscribe() {
    this.hueClient.listen((event) => console.log('Received event! ', event));
  }
}

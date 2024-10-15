import { Injectable } from '@nestjs/common';
import { EnvService } from '../env/env.service';
import { lightsSchema } from './schema';

@Injectable()
export class HueClient {
  private readonly baseUrl: string;
  private readonly clientKey: string;

  private readonly username: string;

  constructor(private readonly envService: EnvService) {
    (process.env['NODE_TLS_REJECT_UNAUTHORIZED'] as any) = 0;
    this.clientKey = envService.get('HUE_BRIDGE_CLIENT_KEY');
    this.username = envService.get('HUE_BRIDGE_USER');
    this.baseUrl = `${envService.get('HUE_BRIDGE_HOST')}:${envService.get('HUE_BRIDGE_PORT')}/clip/v2`;
  }

  async getLights() {
    return lightsSchema.parse(await this.request('resource/light'));
  }

  async setLight(id: string, on: boolean) {
    return this.request(`resource/light/${id}`, {
      method: 'PUT',
      body: `{"on": {"on": ${on}}}`,
    });
  }

  private async request(
    endpoint: string,
    options: RequestInit = { headers: {}, method: 'GET' },
  ) {
    if (!options.headers) {
      options.headers = {};
    }
    if (options.body && options.method !== 'GET') {
      options.headers['Content-Type'] = 'application/json';
    }
    options.keepalive = true;
    options.headers['hue-application-key'] = this.username;
    const url = `https://${this.baseUrl}/${endpoint}`;
    console.log(options);
    console.log(url);
    try {
      const response = await fetch(url, options);
      return response.json();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}

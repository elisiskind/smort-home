import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { EnvService } from '../env/env.service';
import {
  lightsSchema,
  LightUpdate,
  lightUpdateSchema,
  roomsSchema,
} from './hue.schema';
import { z } from 'zod';
import EventSource from 'eventsource';
import { HueLightEvent, HueUpdate } from '@smort-home/firestore';

@Injectable()
export class HueService implements OnModuleDestroy {
  private readonly baseUrl: string;
  private readonly eventBaseUrl: string;
  private readonly username: string;

  private readonly logger = new Logger(HueService.name);

  private eventSource: EventSource | null = null;

  constructor(readonly envService: EnvService) {
    (process.env['NODE_TLS_REJECT_UNAUTHORIZED'] as any) = 0;
    this.username = envService.get('HUE_BRIDGE_USER');
    this.baseUrl = `${envService.get('HUE_BRIDGE_HOST')}:${envService.get('HUE_BRIDGE_PORT')}/clip/v2`;
    this.eventBaseUrl = `https://${envService.get('HUE_BRIDGE_HOST')}:${envService.get('HUE_BRIDGE_PORT')}/eventstream/clip/v2`;
  }

  async getLights() {
    const response = await this.request('resource/light');
    return lightsSchema.parse(response);
  }

  async getRooms() {
    this.getGroups();
    const response = await this.request('resource/room');
    return roomsSchema.parse(response);
  }

  async getGroups() {
    const response = await this.request('/resource/device');
    console.log(JSON.stringify(response, null, 2));
  }

  async setLight(id: string, state: HueUpdate) {
    return this.request(`resource/light/${id}`, {
      method: 'PUT',
      body: JSON.stringify(state),
    });
  }

  listen(onEvent: (event: LightUpdate) => void) {
    if (this.eventSource === null) {
      this.eventSource = new EventSource(this.eventBaseUrl, {
        headers: {
          Accept: 'text/event-stream',
          'hue-application-key': this.username,
        },
        https: {
          rejectUnauthorized: false,
        },
      });
    }
    const listener = (message: MessageEvent) => {
      const parsed = z
        .array(
          z
            .object({
              data: z.array(z.object({ type: z.string() }).passthrough()),
            })
            .transform((data) => data.data),
        )
        .parse(JSON.parse(message.data));

      parsed
        .flatMap((data) => data)
        .filter((data) => data.type === 'light')
        .map((data) => lightUpdateSchema.parse(data))
        .forEach((update) => onEvent(update));
    };
    this.eventSource.addEventListener('message', listener);
    return () => this.eventSource.removeEventListener('message', listener);
  }

  onModuleDestroy() {
    this.eventSource?.close();
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
    try {
      const response = await fetch(url, options);
      return response.json();
    } catch (e) {
      this.logger.error('Failed to send hue request: ', endpoint, options, e);
    }
  }

  async handleHueEvent(event: HueLightEvent) {
    await this.setLight(event.id, event.state);
  }
}

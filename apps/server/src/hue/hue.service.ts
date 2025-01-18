import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { EnvService } from '../env/env.service';

import { z } from 'zod';
import EventSource from 'eventsource';
import { HueLightEvent, LightUpdate } from '@smort-home/firestore';
import { transformLightUpdate } from './schemas/transformations';
import {
  HueButtonEvent,
  hueButtonEventSchema,
  HueLightUpdateEvent,
  hueLightUpdateSchema,
  lightsSchema,
} from './schemas/lightSchema';
import { groupsSchema, roomsSchema } from './schemas/roomSchema';
import { behaviorsSchema } from './schemas/automationSchema';
import { HueBridgeMetadata } from './hueBridgeDiscovery';

@Injectable()
export class HueService implements OnModuleDestroy {
  private readonly baseUrl: string;
  private readonly eventBaseUrl: string;
  private readonly username: string;

  private readonly logger = new Logger(HueService.name);

  private eventSource: EventSource | null = null;

  constructor(
    readonly envService: EnvService,
    @Inject('HUE_BRIDGE_METADATA') hueBridgeMetadata: HueBridgeMetadata,
  ) {
    (process.env['NODE_TLS_REJECT_UNAUTHORIZED'] as any) = 0;
    this.username = envService.get('HUE_BRIDGE_USER');
    this.baseUrl = `${hueBridgeMetadata.ip}:${hueBridgeMetadata.port}/clip/v2`;
    this.eventBaseUrl = `https://${hueBridgeMetadata.ip}:${hueBridgeMetadata.port}/eventstream/clip/v2`;
  }

  async getLights() {
    const response = await this.request('resource/light');
    return lightsSchema.parse(response);
  }

  async getRooms() {
    const response = await this.request('resource/room');
    return roomsSchema.parse(response);
  }

  async getGroups() {
    const response = await this.request('resource/grouped_light');
    return groupsSchema.parse(response);
  }

  async getBehaviors() {
    const response = await this.request('resource/behavior_instance');
    return behaviorsSchema.parse(response);
  }

  async setLight(id: string, update: LightUpdate) {
    return this.request(`resource/light/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transformLightUpdate(id, update)),
    });
  }

  listen(
    onLightEvent: (event: HueLightUpdateEvent) => void,
    onButtonEvent: (event: HueButtonEvent) => void,
  ) {
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
            .transform(({ data }) => data),
        )
        .parse(JSON.parse(message.data));

      parsed
        .flatMap((data) => data)
        .filter((data) => data.type === 'light')
        .map((data) => hueLightUpdateSchema.parse(data))
        .forEach(onLightEvent);

      parsed
        .flatMap((data) => data)
        .filter((data) => data.type === 'button')
        .map((data) => hueButtonEventSchema.parse(data))
        .forEach(onButtonEvent);
    };
    this.eventSource.addEventListener('message', listener);
    return () => this.eventSource?.removeEventListener('message', listener);
  }

  onModuleDestroy() {
    this.eventSource?.close();
  }

  async handleHueEvent(event: HueLightEvent) {
    await this.setLight(event.id, event.state);
  }

  private async request(
    endpoint: string,
    options: RequestInit = { headers: {}, method: 'GET' },
  ): Promise<unknown> {
    if (!options.headers) {
      options.headers = {};
    }
    if (options.body && options.method !== 'GET') {
      (options.headers as any)['Content-Type'] = 'application/json';
    }
    options.keepalive = true;
    (options.headers as any)['hue-application-key'] = this.username;
    const url = `https://${this.baseUrl}/${endpoint}`;
    try {
      const response = await fetch(url, options);
      return response.json();
    } catch (e) {
      this.logger.error('Failed to send hue request: ', endpoint, options, e);
      throw new Error(`Failed to send hue request: ${endpoint}`);
    }
  }
}

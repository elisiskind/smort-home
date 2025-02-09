import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import {
  HueLightUpdateEvent,
  hueLightUpdateSchema,
} from '../schemas/hue.light.schema';
import EventSource from 'eventsource';
import { z } from 'zod';
import { EnvService } from '../../env/env.service';
import {
  HueButtonEvent,
  hueButtonEventSchema,
} from '../schemas/hue.button.schema';
import { HueBridgeMetadata } from '../hue.bridge.factory';

@Injectable()
export class HueEventsService implements OnModuleDestroy {
  private eventSource: EventSource | null = null;
  private readonly eventBaseUrl: string;
  private readonly username: string;

  constructor(
    readonly envService: EnvService,
    @Inject('HUE_BRIDGE_METADATA') hueBridgeMetadata: HueBridgeMetadata,
  ) {
    (process.env['NODE_TLS_REJECT_UNAUTHORIZED'] as any) = 0;
    this.username = envService.get('HUE_BRIDGE_USER');
    this.eventBaseUrl = `https://${hueBridgeMetadata.ip}:${hueBridgeMetadata.port}/eventstream/clip/v2`;
  }

  listen(
    onLightEvent: (event: HueLightUpdateEvent) => void,
    onButtonEvent: (event: HueButtonEvent) => void,
  ) {
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
    this.getEventSource().addEventListener('message', listener);
    return () => this.eventSource?.removeEventListener('message', listener);
  }

  onModuleDestroy() {
    this.eventSource?.close();
  }

  private getEventSource() {
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
    return this.eventSource;
  }
}

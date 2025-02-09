import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
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

const baseHueEventSchema = z
  .array(
    z.object({
      data: z.array(z.object({ type: z.string() }).passthrough()),
    }),
  )
  .transform((events) => events.flatMap(({ data }) => data));

export type HueEvent = { type: string };

@Injectable()
export class HueEventsService implements OnModuleDestroy, OnModuleInit {
  private eventSource: EventSource | null = null;
  private readonly eventBaseUrl: string;
  private readonly username: string;
  private readonly subscriptions: Record<
    string,
    ((event: HueEvent) => void)[]
  > = {};

  constructor(
    readonly envService: EnvService,
    @Inject('HUE_BRIDGE_METADATA') hueBridgeMetadata: HueBridgeMetadata,
  ) {
    (process.env['NODE_TLS_REJECT_UNAUTHORIZED'] as any) = 0;
    this.username = envService.get('HUE_BRIDGE_USER');
    this.eventBaseUrl = `https://${hueBridgeMetadata.ip}:${hueBridgeMetadata.port}/eventstream/clip/v2`;
  }

  subscribe(eventName: string, onEvent: (event: HueEvent) => void) {
    this.subscriptions[eventName] = [
      ...(this.subscriptions[eventName] ?? []),
      onEvent,
    ];
  }

  onModuleInit() {
    const listener = (message: MessageEvent) => {
      const parsed = baseHueEventSchema.parse(JSON.parse(message.data));

      parsed.forEach((event) => {
        const handlers = this.subscriptions[event.type] ?? [];
        handlers.forEach((onEvent) => onEvent(event));
      });
    };
    this.getEventSource().addEventListener('message', listener);
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

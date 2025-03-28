import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { AlarmEvent, LightEvent } from '@smort-home/firestore';
import { HueAlarmService } from './services/hue.alarm.service';
import { HueEventsService } from './services/hue.events.service';
import { HueLightService } from './services/hue.light.service';
import { HueRoomService } from './services/hue.room.service';
import {
  HueLightUpdateEvent,
  hueLightUpdateSchema,
} from './schemas/hue.light.schema';
import {
  HueButtonEvent,
  hueButtonEventSchema,
} from './schemas/hue.button.schema';
import {
  hueAlarmEventSchema,
  HueAlarmUpdateEvent,
} from './schemas/hue.alarm.schema';
import { EnvService } from '../env/env.service';

@Injectable()
export class HueService {
  private readonly logger = new Logger(HueService.name);

  constructor(
    private readonly alarmService: HueAlarmService,
    private readonly eventService: HueEventsService,
    private readonly lightService: HueLightService,
    private readonly roomService: HueRoomService,
    private readonly envService: EnvService,
  ) {}

  async getRooms() {
    return this.roomService.getRooms();
  }

  async getLights() {
    return this.lightService.getLights();
  }

  async getAlarms() {
    return this.alarmService.getAlarms();
  }

  async handleHueLightEvent(event: LightEvent) {
    await this.lightService.setLight(event.id, event.state);
  }

  async handleHueAlarmEvent(event: AlarmEvent) {
    if (event.state.when) {
      this.logger.debug('Alarm event: ', event);
      await this.alarmService.setAlarmTrigger(event.state.when);
    }
    if (event.state.enabled !== undefined) {
      await this.alarmService.setAlarmEnabled(event.state.enabled);
    }
  }

  // events from hue bridge, not from the app
  handleLightEvents(onLightEvent: (event: HueLightUpdateEvent) => void) {
    this.eventService.subscribe('light', (event) =>
      onLightEvent(hueLightUpdateSchema.parse(event)),
    );
  }

  // events from hue bridge, not from the app
  handleButtonEvents(onButtonEvent: (event: HueButtonEvent) => void) {
    this.eventService.subscribe('button', (event) =>
      onButtonEvent(hueButtonEventSchema.parse(event)),
    );
  }

  // events from hue bridge, not from the app
  handleAlarmEvents(onAlarmEvents: (event: HueAlarmUpdateEvent) => void) {
    this.eventService.subscribe('behavior_instance', (event) => {
      const parsed = hueAlarmEventSchema(
        this.envService.get('HUE_ALARM_ID'),
      ).parse(event);
      if (!parsed.ignore) {
        onAlarmEvents(parsed);
      }
    });
  }
}

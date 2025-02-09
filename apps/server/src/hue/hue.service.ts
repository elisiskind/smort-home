import { Injectable } from '@nestjs/common';
import { HueLightEvent } from '@smort-home/firestore';
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

@Injectable()
export class HueService {
  constructor(
    private readonly alarmService: HueAlarmService,
    private readonly eventService: HueEventsService,
    private readonly lightService: HueLightService,
    private readonly roomService: HueRoomService,
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

  async handleHueEvent(event: HueLightEvent) {
    await this.lightService.setLight(event.id, event.state);
  }

  handleLightEvents(onLightEvent: (event: HueLightUpdateEvent) => void) {
    this.eventService.subscribe('light', (event) =>
      onLightEvent(hueLightUpdateSchema.parse(event)),
    );
  }

  handleButtonEvents(onButtonEvent: (event: HueButtonEvent) => void) {
    this.eventService.subscribe('button', (event) =>
      onButtonEvent(hueButtonEventSchema.parse(event)),
    );
  }
}

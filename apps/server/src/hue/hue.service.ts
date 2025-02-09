import { Injectable } from '@nestjs/common';
import { HueLightEvent } from '@smort-home/firestore';
import { HueAlarmService } from './services/hue.alarm.service';
import { HueEventsService } from './services/hue.events.service';
import { HueLightService } from './services/hue.light.service';
import { HueRoomService } from './services/hue.room.service';
import { HueLightUpdateEvent } from './schemas/hue.light.schema';
import { HueButtonEvent } from './schemas/hue.button.schema';

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

  async listen(
    onLightEvent: (event: HueLightUpdateEvent) => void,
    onButtonEvent: (event: HueButtonEvent) => void,
  ) {
    this.eventService.listen(onLightEvent, onButtonEvent);
  }
}

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { HueService } from './hue/hue.service';
import { FirestoreService } from './firestore/firestore.service';
import { SonosService } from './sonos/sonos.service';
import { FirestoreEventsService } from './firestore/firestoreEvents.service';
import { ArduinoService } from './arduino/arduino.service';
import { AppEvent } from '@smort-home/firestore';
import { Cron } from '@nestjs/schedule';
import { HueButtonEvent } from './hue/schemas/lightSchema';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);
  private unsubscribe: (() => void) | null = null;

  constructor(
    private readonly firestoreService: FirestoreService,
    private readonly firestoreEventsService: FirestoreEventsService,
    private readonly hueService: HueService,
    private readonly sonosService: SonosService,
    private readonly arduinoService: ArduinoService,
  ) {}

  async onModuleInit() {
    await Promise.all([
      this.persistLightsStateAndListen(),
      this.persistSpeakerStateAndListen(),
    ]);
    this.listenForClientEvents();
  }

  helloWorld() {
    return 'hello world';
  }

  async syncLightsState() {
    const groups = await this.hueService.getGroups();

    const rooms = await this.hueService.getRooms();
    const hydrated = rooms.map((room) => ({
      ...room,
      group: groups.find(({ owner }) => owner === room.id) ?? null,
    }));
    await this.firestoreService.updateRooms(hydrated);

    const lights = await this.hueService.getLights();
    await this.firestoreService.updateLights(lights);

    const behaviors = await this.hueService.getBehaviors();
    await this.firestoreService.updateBehaviors(behaviors);
  }

  private async persistLightsStateAndListen() {
    await this.syncLightsState();
    this.hueService.listen(
      (event) => this.firestoreService.syncLight(event),
      (event) => this.onHueButtonEvent(event),
    );
  }

  private onHueButtonEvent(event: HueButtonEvent) {
    if (
      event.buttonEvent === 'initial_press' &&
      event.id === 'd8fa4ce6-b76c-409a-9228-4a7e0f6d7d98'
    ) {
      this.arduinoService.spray();
    }
  }

  private async persistSpeakerStateAndListen() {
    const speakers = await this.sonosService.getDevices();
    await this.firestoreService.syncSonosDevices(speakers);

    const alarms = await this.sonosService.getAlarms();
    await this.firestoreService.syncSonosAlarms(alarms);

    this.sonosService.listenForUpdates().subscribe((update) => {
      this.firestoreService.syncSonosDevice(update);
    });
  }

  private readonly onEvent = async (event: AppEvent) => {
    if (event.type === 'sonos.playback') {
      await this.sonosService.handlePlaybackEvent(event.data);
    } else if (event.type === 'hue.light') {
      await this.hueService.handleHueEvent(event.data);
    } else if (event.type === 'antibean.spray') {
      await this.arduinoService.spray();
    }
  };

  @Cron('0 0 * * *')
  private refreshSubscription() {
    this.logger.log('Refreshing subscription for new day.');
    this.listenForClientEvents();
  }

  private listenForClientEvents() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    this.unsubscribe = this.firestoreEventsService.onEvent(this.onEvent);
  }
}

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { HueService } from './hue/hue.service';
import { FirestoreService } from './firestore/firestore.service';
import { SonosService } from './sonos/sonos.service';
import { FirestoreEventsService } from './firestore/firestoreEvents.service';
import { ArduinoService } from './arduino/arduino.service';
import { AppEvent } from '@smort-home/firestore';
import { Cron } from '@nestjs/schedule';
import { HueButtonEvent } from './hue/schemas/hue.button.schema';

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
      this.persistHueStateAndListen(),
      this.persistSpeakerStateAndListen(),
    ]);
    this.listenForClientEvents();
  }

  helloWorld() {
    return 'hello world';
  }

  async syncLightsState() {
    const rooms = await this.hueService.getRooms();
    await this.firestoreService.updateRooms(rooms);

    const lights = await this.hueService.getLights();
    await this.firestoreService.updateLights(lights);

    const alarms = await this.hueService.getAlarms();
    await this.firestoreService.updateAlarms(alarms);
  }

  private async persistHueStateAndListen() {
    await this.syncLightsState();
    this.hueService.handleLightEvents((event) =>
      this.firestoreService.syncHueLight(event),
    );
    this.hueService.handleAlarmEvents((event) =>
      this.firestoreService.syncHueAlarm(event),
    );
    this.hueService.handleButtonEvents((event) => this.onHueButtonEvent(event));
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

    this.sonosService
      .listenForAlarmUpdates()
      .subscribe(() =>
        this.sonosService
          .getAlarms()
          .then((alarms) => this.firestoreService.syncSonosAlarms(alarms)),
      );
  }

  private readonly onEvent = async (event: AppEvent) => {
    if (event.type === 'sonos.playback') {
      await this.sonosService.handlePlaybackEvent(event.data);
    } else if (event.type === 'hue.light') {
      await this.hueService.handleHueLightEvent(event.data);
    } else if (event.type === 'hue.alarm') {
      await this.hueService.handleHueAlarmEvent(event.data);
    } else if (event.type === 'antibean.spray') {
      this.arduinoService.spray();
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

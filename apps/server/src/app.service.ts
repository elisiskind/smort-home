import { Injectable, OnModuleInit } from '@nestjs/common';
import { HueService } from './hue/hue.service';
import { FirestoreService } from './firestore/firestore.service';
import { SonosService } from './sonos/sonos.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private readonly firestoreService: FirestoreService,
    private readonly hueService: HueService,
    private readonly sonosService: SonosService,
  ) {}

  async onModuleInit() {
    await Promise.all([
      this.persistLightsStateAndListen(),
      this.persistSpeakerStateAndListen(),
    ]);
  }

  private async persistLightsStateAndListen() {
    const lights = await this.hueService.getLights();
    await this.firestoreService.updateLights(lights);
    this.hueService.listen((update) =>
      this.firestoreService.updateLight(update),
    );
  }

  private async persistSpeakerStateAndListen() {
    const speakers = await this.sonosService.getDevices();
    await this.firestoreService.updateSonosDevices(speakers);
    this.sonosService.listenForUpdates().subscribe((update) => {
      this.firestoreService.updateSonosDevice(update);
    });
  }
}

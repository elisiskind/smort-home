import { Injectable, OnModuleInit } from '@nestjs/common';
import { HueService } from './hue/hue.service';
import { FirestoreService } from './firestore/firestore.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private readonly firestoreService: FirestoreService,
    private readonly hueService: HueService,
  ) {}

  async onModuleInit() {
    const lights = await this.hueService.getLights();
    await this.firestoreService.updateLights(lights);
    this.hueService.listen((update) =>
      this.firestoreService.updateLight(update),
    );
  }
}

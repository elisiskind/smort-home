import { Injectable, Scope } from '@nestjs/common';
import { applicationDefault, initializeApp } from 'firebase-admin/app';
import { Firestore, getFirestore } from 'firebase-admin/firestore';
import {
  Light as HueLight,
  LightUpdate as HueLightUpdate,
} from '../hue/hue.schema';

@Injectable({ scope: Scope.DEFAULT })
export class FirestoreService {
  private readonly db: Firestore;

  constructor() {
    initializeApp({
      credential: applicationDefault(),
    });
    this.db = getFirestore();
  }

  async updateLights(lights: HueLight[]) {
    const batch = this.db.batch();
    lights.forEach((light) => {
      batch.set(this.lightsCollection().doc(light.id), light);
    });
    await batch.commit();
  }

  async updateLight(light: HueLightUpdate) {
    await this.lightsCollection().doc(light.id).update(light);
  }

  private lightsCollection() {
    return this.db.collection('home-state/hue/lights');
  }
}

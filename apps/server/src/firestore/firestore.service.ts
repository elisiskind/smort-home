import { Injectable, Logger, Scope } from '@nestjs/common';
import { Firestore } from 'firebase-admin/firestore';

import { SonosDevice, SonosDeviceUpdate } from '../sonos/sonos.service';
import { Behavior, Light, paths, Room } from '@smort-home/firestore';
import { HueLightUpdateEvent } from '../hue/schemas/lightSchema';
const test = (val: boolean) => val;

@Injectable({ scope: Scope.DEFAULT })
export class FirestoreService {
  private readonly logger = new Logger(FirestoreService.name);
  constructor(private readonly db: Firestore) {}

  async updateLights(lights: Light[]) {
    const batch = this.db.batch();
    lights.forEach((light) => {
      batch.set(this.lightsCollection().doc(light.id), light);
    });
    await batch.commit();
  }

  async updateBehaviors(behaviors: Behavior[]) {
    const batch = this.db.batch();
    behaviors.forEach((behavior) => {
      this.logger.log('Behavior: ', behavior);
      batch.set(this.behaviorsCollection().doc(behavior.id), behavior);
    });
    await batch.commit();
  }

  async updateRooms(rooms: Room[]) {
    const batch = this.db.batch();
    rooms.forEach((room) => {
      batch.set(this.roomsCollection().doc(room.id), room);
    });
    await batch.commit();
  }

  async updateLight({
    on,
    id,
    colorTemperature,
    dimming,
  }: HueLightUpdateEvent) {
    const firestoreUpdate = {} as any;

    if (on !== null) {
      firestoreUpdate.on = on;
    }
    if (colorTemperature) {
      firestoreUpdate['colorTemperature.value'] = colorTemperature.value;
      if (colorTemperature.valid !== null) {
        firestoreUpdate['colorTemperature.valid'] = colorTemperature.valid;
      }
    }
    if (dimming) {
      firestoreUpdate.dimming = dimming;
    }

    this.logger.log('Update: ', firestoreUpdate);

    await this.lightsCollection().doc(id).update(firestoreUpdate);
  }

  async updateSonosDevices(sonosDevices: SonosDevice[]) {
    const batch = this.db.batch();
    sonosDevices.forEach((sonosDevice) => {
      batch.set(this.sonosDevicesCollection().doc(sonosDevice.id), sonosDevice);
    });
    await batch.commit();
  }

  async updateSonosDevice(sonosDeviceUpdate: SonosDeviceUpdate) {
    await this.sonosDevicesCollection()
      .doc(sonosDeviceUpdate.id)
      .update(sonosDeviceUpdate);
  }

  private lightsCollection() {
    return this.db.collection(paths.hue.lights);
  }

  private behaviorsCollection() {
    return this.db.collection(paths.hue.behaviors);
  }

  private roomsCollection() {
    return this.db.collection(paths.hue.rooms);
  }

  private sonosDevicesCollection() {
    return this.db.collection(paths.sonos.devices);
  }
}

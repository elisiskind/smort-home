import { Injectable, Logger, Scope } from '@nestjs/common';
import { Firestore } from 'firebase-admin/firestore';

import {
  SonosAlarm,
  SonosDevice,
  SonosDeviceUpdate,
} from '../sonos/sonos.service';
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
    // behaviors.forEach((behavior) => {
    //   this.logger.log('Behavior: ', behavior);
    //   batch.set(this.behaviorsCollection().doc(behavior.id), behavior);
    // });
    await batch.commit();
  }

  async updateRooms(rooms: Room[]) {
    const batch = this.db.batch();
    rooms.forEach((room) => {
      batch.set(this.roomsCollection().doc(room.id), room);
    });
    await batch.commit();
  }

  async syncLight({ on, id, colorTemperature, dimming }: HueLightUpdateEvent) {
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
    if (Object.keys(firestoreUpdate)) {
      try {
        await this.lightsCollection().doc(id).update(firestoreUpdate);
      } catch (e) {
        this.logger.error('Failed to apply hue update: ', firestoreUpdate, e);
      }
    }
  }

  async syncSonosDevices(sonosDevices: SonosDevice[]) {
    const batch = this.db.batch();
    sonosDevices.forEach((sonosDevice) => {
      batch.set(this.sonosDevicesCollection().doc(sonosDevice.id), sonosDevice);
    });
    await batch.commit();
  }

  async syncSonosAlarms(sonosAlarms: SonosAlarm[]) {
    const batch = this.db.batch();
    sonosAlarms.forEach((sonosAlarm) => {
      batch.set(this.sonosAlarmsCollection().doc(sonosAlarm.id), sonosAlarm);
    });
    await batch.commit();
  }

  async syncSonosDevice(sonosDeviceUpdate: SonosDeviceUpdate) {
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

  private sonosAlarmsCollection() {
    return this.db.collection(paths.sonos.alarms);
  }
}

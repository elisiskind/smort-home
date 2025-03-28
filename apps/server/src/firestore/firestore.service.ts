import { Injectable, Logger, Scope } from '@nestjs/common';
import { Firestore } from 'firebase-admin/firestore';

import { SonosDevice, SonosDeviceUpdate } from '../sonos/sonos.service';
import {
  FsAlarm,
  fsAlarmSchema,
  FsHueAlarm,
  fsHueAlarmSchema,
  fsHueLight,
  FsHueRoom,
  FsSonosAlarm,
  fsSonosAlarmSchema,
  paths,
} from '@smort-home/firestore';
import { HueLightUpdateEvent } from '../hue/schemas/hue.light.schema';
import { HueAlarmUpdateEvent } from '../hue/schemas/hue.alarm.schema';
import { Observable } from 'rxjs';
import { z } from 'zod';
import { firestore } from 'firebase-admin';
import CollectionReference = firestore.CollectionReference;

@Injectable({ scope: Scope.DEFAULT })
export class FirestoreService {
  private readonly logger = new Logger(FirestoreService.name);

  constructor(private readonly db: Firestore) {}

  async updateLights(lights: fsHueLight[]) {
    const batch = this.db.batch();
    lights.forEach((light) => {
      batch.set(this.hueLightsCollection().doc(light.id), light);
    });
    await batch.commit();
  }

  async updateAlarms(alarms: FsHueAlarm[]) {
    const batch = this.db.batch();
    alarms.forEach((behavior) => {
      batch.set(this.hueAlarmsCollection().doc(behavior.id), behavior);
    });
    await batch.commit();
  }

  async updateRooms(rooms: FsHueRoom[]) {
    const batch = this.db.batch();
    rooms.forEach((room) => {
      batch.set(this.roomsCollection().doc(room.id), room);
    });
    await batch.commit();
  }

  async syncHueLight({
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
    if (Object.keys(firestoreUpdate).length) {
      try {
        await this.hueLightsCollection().doc(id).update(firestoreUpdate);
      } catch (e) {
        this.logger.error('Failed to apply hue update: ', firestoreUpdate, e);
      }
    }
  }

  async syncHueAlarm({ id, enabled, name, trigger }: HueAlarmUpdateEvent) {
    const firestoreUpdate = {} as any;

    if (enabled !== null) {
      firestoreUpdate.enabled = enabled;
    }
    if (name) {
      firestoreUpdate.name = name;
    }
    if (trigger) {
      firestoreUpdate.trigger = trigger;
    }
    if (Object.keys(firestoreUpdate).length) {
      try {
        await this.hueAlarmsCollection().doc(id).update(firestoreUpdate);
      } catch (e) {
        this.logger.error('Failed to apply hue update: ', firestoreUpdate, e);
      }
    }
  }

  getHueAlarmSnapshot(): Observable<FsHueAlarm[]> {
    return this.getSnapshot(this.hueAlarmsCollection(), fsHueAlarmSchema);
  }

  getSonosAlarmSnapshot(): Observable<FsSonosAlarm[]> {
    return this.getSnapshot(this.sonosAlarmsCollection(), fsSonosAlarmSchema);
  }

  async getAlarms(): Promise<FsAlarm[]> {
    const snapshot = await this.alarmsCollection().get();
    return snapshot.docs.map((doc) => fsAlarmSchema.parse(doc.data()));
  }

  async syncSonosDevices(sonosDevices: SonosDevice[]) {
    const batch = this.db.batch();
    sonosDevices.forEach((sonosDevice) => {
      batch.set(this.sonosDevicesCollection().doc(sonosDevice.id), sonosDevice);
    });
    await batch.commit();
  }

  async syncSonosAlarms(sonosAlarms: FsSonosAlarm[]) {
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

  private getSnapshot<SCHEMA extends z.ZodTypeAny>(
    collectionReference: CollectionReference,
    schema: SCHEMA,
  ) {
    return new Observable<z.infer<SCHEMA>[]>((subscriber) => {
      collectionReference.onSnapshot((snapshot) => {
        subscriber.next(snapshot.docs.map((doc) => schema.parse(doc.data())));
      });
    });
  }

  private hueLightsCollection() {
    return this.db.collection(paths.hue.lights);
  }

  private hueAlarmsCollection() {
    return this.db.collection(paths.hue.alarms);
  }

  private alarmsCollection() {
    return this.db.collection(paths.alarms);
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

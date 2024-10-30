import { Injectable, Scope } from '@nestjs/common';
import { Firestore } from 'firebase-admin/firestore';
import {
  Light as HueLight,
  Room as HueRoom,
  LightUpdate as HueLightUpdate,
} from '../hue/hue.schema';
import { SonosDevice, SonosDeviceUpdate } from '../sonos/sonos.service';
import { paths } from '@smort-home/firestore';

@Injectable({ scope: Scope.DEFAULT })
export class FirestoreService {
  constructor(private readonly db: Firestore) {}

  async updateLights(lights: HueLight[]) {
    const batch = this.db.batch();
    lights.forEach((light) => {
      batch.set(this.lightsCollection().doc(light.id), light);
    });
    await batch.commit();
  }
  async updateRooms(rooms: HueRoom[]) {
    const batch = this.db.batch();
    rooms.forEach((room) => {
      batch.set(this.roomsCollection().doc(room.id), room);
    });
    await batch.commit();
  }

  async updateLight(light: HueLightUpdate) {
    await this.lightsCollection().doc(light.id).update(light);
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
    return this.db.collection(paths.lights);
  }
  private roomsCollection() {
    return this.db.collection(paths.rooms);
  }

  private sonosDevicesCollection() {
    return this.db.collection(paths.sonosDevices);
  }
}

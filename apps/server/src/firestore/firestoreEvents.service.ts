import { Injectable, Scope } from '@nestjs/common';
import { Firestore, getFirestore } from 'firebase-admin/firestore';
import { AppEvent, appEventSchema, paths } from '@smort-home/firestore';
import { FirestoreService } from './firestore.service';
import { HueService } from '../hue/hue.service';
import { SonosService } from '../sonos/sonos.service';

@Injectable({ scope: Scope.DEFAULT })
export class FirestoreEventsService {
  private readonly db: Firestore;

  constructor() {
    this.db = getFirestore();
  }

  onEvent(handleEvent: (event: AppEvent) => Promise<void>) {
    this.db.collection(paths.events()).onSnapshot((snapshot) => {
      snapshot.docChanges().map((change) => {
        if (change.type === 'added') {
          console.log(change.doc.data());
          handleEvent(appEventSchema.parse(change.doc.data())).then(() =>
            change.doc.ref.set(
              {
                handled: true,
              },
              { merge: true },
            ),
          );
        }
      });
    });
  }
}

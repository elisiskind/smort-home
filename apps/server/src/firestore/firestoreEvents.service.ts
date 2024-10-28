import { Injectable, Logger } from '@nestjs/common';
import { Firestore } from 'firebase-admin/firestore';
import { AppEvent, appEventSchema, paths } from '@smort-home/firestore';
import { AppService } from '../app.service';

@Injectable()
export class FirestoreEventsService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly db: Firestore) {}

  onEvent(handleEvent: (event: AppEvent) => Promise<void>) {
    this.db
      .collection(paths.events())
      .where('handled', '==', false)
      .onSnapshot((snapshot) => {
        snapshot.docChanges().map((change) => {
          if (change.type === 'added') {
            handleEvent(appEventSchema.parse(change.doc.data()))
              .then(() =>
                change.doc.ref.set({ handled: true }, { merge: true }),
              )
              .catch((error) => {
                this.logger.error('Failed to handle event: ', error);
                return change.doc.ref.set({ error }, { merge: true });
              });
          }
        });
      });
  }
}

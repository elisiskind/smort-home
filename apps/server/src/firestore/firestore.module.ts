import { Module } from '@nestjs/common';
import { FirestoreService } from './firestore.service';
import { FirestoreEventsService } from './firestoreEvents.service';
import { Firestore, getFirestore } from 'firebase-admin/firestore';
import { applicationDefault, initializeApp } from 'firebase-admin/app';

@Module({
  providers: [
    FirestoreService,
    FirestoreEventsService,
    {
      provide: Firestore,
      useFactory: () => {
        initializeApp({
          credential: applicationDefault(),
        });
        return getFirestore();
      },
    },
  ],
  exports: [FirestoreService, FirestoreEventsService],
})
export class FirestoreModule {}

import { Module } from '@nestjs/common';
import { FirestoreService } from './firestore.service';
import { FirestoreEventsService } from './firestoreEvents.service';

@Module({
  providers: [FirestoreService, FirestoreEventsService],
  exports: [FirestoreService, FirestoreEventsService],
})
export class FirestoreModule {}

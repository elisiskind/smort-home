import { paths, SonosPlaybackEvent } from '@smort-home/firestore';
import { doc, setDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import { DateTime } from 'luxon';

export const updatePlaybackState = async (data: SonosPlaybackEvent) => {
  const eventDoc = doc(firestore, paths.events(), DateTime.now().toISOTime());
  await setDoc(eventDoc, {
    type: 'sonos.playback',
    handled: false,
    data,
  });
};

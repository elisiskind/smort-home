import { useFirestoreCollection } from '../hooks/useFirestoreCollection';
import { fsHueAlarmSchema, AlarmEvent, paths } from '@smort-home/firestore';
import { doc, setDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import { DateTime } from 'luxon';

export const useHueAlarms = () => {
  return useFirestoreCollection(paths.hue.alarms, fsHueAlarmSchema);
};

export const updateHueAlarm = async (data: AlarmEvent) => {
  const eventDoc = doc(firestore, paths.events(), DateTime.now().toISOTime());
  await setDoc(eventDoc, {
    type: 'hue.alarm',
    handled: false,
    data,
  });
};

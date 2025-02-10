import { doc, setDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import {
  alarmSchema,
  AlarmEvent,
  HueAlarmUpdate,
  LightEvent,
  lightSchema,
  paths,
  roomSchema,
} from '@smort-home/firestore';
import { DateTime } from 'luxon';
import { useFirestoreCollection } from '../hooks/useFirestoreCollection';
import {
  errorResult,
  loadingResult,
  successResult,
} from '../hooks/dataWrappingUtils';

export const updateHueLight = async (data: LightEvent) => {
  const eventDoc = doc(firestore, paths.events(), DateTime.now().toISOTime());
  await setDoc(eventDoc, {
    type: 'hue.light',
    handled: false,
    data,
  });
};

export const useHueLights = () => {
  const lightsResult = useFirestoreCollection(paths.hue.lights, lightSchema);
  const roomsResult = useFirestoreCollection(paths.hue.rooms, roomSchema);

  if (lightsResult.isSuccess && roomsResult.isSuccess) {
    const data = roomsResult.data.map((room) => ({
      room,
      lights: lightsResult.data.filter(({ rid }) => room.lights.includes(rid)),
    }));
    return successResult(data);
  } else if (lightsResult.isError) {
    return errorResult('Failed to load lights: ' + lightsResult.error);
  } else if (roomsResult.isError) {
    return errorResult('Failed to load rooms: ' + roomsResult.error);
  } else {
    return loadingResult;
  }
};

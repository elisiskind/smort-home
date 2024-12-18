import { doc, setDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import {
  behaviorSchema,
  HueLightEvent,
  lightSchema,
  paths,
  roomSchema,
} from '@smort-home/firestore';
import { DateTime } from 'luxon';
import { useFirestoreCollection } from './useFirestoreCollection';
import { errorResult, loadingResult, successResult } from './dataWrappingUtils';

export const updateHueLight = async (data: HueLightEvent) => {
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

export const useHueBehaviors = () => {
  const result = useFirestoreCollection(paths.hue.behaviors, behaviorSchema);
  const updateBehavior = async (data: any) => {
    const eventDoc = doc(firestore, paths.events(), DateTime.now().toISOTime());
    await setDoc(eventDoc, {
      type: 'hue.behavior',
      handled: false,
      data,
    });
  };

  return { result, updateBehavior };
};

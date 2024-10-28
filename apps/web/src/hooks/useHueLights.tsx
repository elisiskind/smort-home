import { doc, setDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import { HueLightEvent, paths } from '@smort-home/firestore';
import { DateTime } from 'luxon';
import { useFirestoreCollection } from './useFirestoreCollection';
import { lightSchema } from '../api/schema';

export const useHueLights = () => {
  const result = useFirestoreCollection(paths.lights, lightSchema);
  const updateLight = async (data: HueLightEvent) => {
    const eventDoc = doc(firestore, paths.events(), DateTime.now().toISOTime());
    await setDoc(eventDoc, {
      type: 'hue.light',
      handled: false,
      data,
    });
  };

  return { result, updateLight };
};

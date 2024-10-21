import { useCollection } from 'react-firebase-hooks/firestore';
import { collection } from 'firebase/firestore';
import { firestore } from '../firebase';
import { z } from 'zod';

type UseFirestoreCollectionResult<S extends z.ZodTypeAny> =
  | {
      isLoading: false;
      isError: true;
      isSuccess: true;
      data: z.infer<S>[];
    }
  | {
      isLoading: false;
      isError: true;
      isSuccess: false;
      error: string;
    }
  | {
      isLoading: true;
      isError: false;
      isSuccess: false;
    };

export const useFirestoreCollection = <S extends z.ZodTypeAny>(
  path: string,
  schema: S,
): UseFirestoreCollectionResult<S> => {
  const [result, _, error] = useCollection(collection(firestore, path));

  if (result) {
    return {
      isLoading: false,
      isError: true,
      isSuccess: true,
      data: result.docs.map((doc) => schema.parse(doc.data())),
    };
  } else if (error) {
    return {
      isLoading: false,
      isError: true,
      isSuccess: false,
      error: error.message,
    };
  } else {
    return {
      isLoading: true,
      isError: false,
      isSuccess: false,
    };
  }
};

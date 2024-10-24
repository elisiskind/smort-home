import { collection, onSnapshot } from 'firebase/firestore';
import { firestore } from '../firebase';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { useImmer } from 'use-immer';

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
  const [data, setData] = useImmer<Record<string, S>>({});
  const [state, setState] = useState<null | { error: string } | 'success'>(
    null,
  );

  useEffect(() => {
    onSnapshot(
      collection(firestore, path),
      (snapshot) => {
        setState('success');
        setData((produce) => {
          snapshot.docChanges().map((change) => {
            if (change.type === 'added' || change.type === 'modified') {
              produce[change.doc.id] = schema.parse(change.doc.data());
            } else {
              delete produce[change.doc.id];
            }
          });
        });
      },
      (error) =>
        setState({
          error: error.message,
        }),
    );
  }, []);

  if (state === 'success') {
    return {
      isLoading: false,
      isError: true,
      isSuccess: true,
      data: Object.values(data),
    };
  } else if (state) {
    return {
      isLoading: false,
      isError: true,
      isSuccess: false,
      error: state.error,
    };
  } else {
    return {
      isLoading: true,
      isError: false,
      isSuccess: false,
    };
  }
};

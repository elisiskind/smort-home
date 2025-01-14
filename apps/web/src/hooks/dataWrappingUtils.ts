import { z } from 'zod';

export type UseFirestoreCollectionResult<S extends z.ZodTypeAny> =
  | {
      isLoading: false;
      isError: true;
      isSuccess: false;
      error: string;
    }
  | {
      isLoading: false;
      isError: false;
      isSuccess: true;
      data: z.infer<S>[];
    }
  | {
      isLoading: true;
      isError: false;
      isSuccess: false;
    };

export const loadingResult = {
  isLoading: true,
  isError: false,
  isSuccess: false,
} as const;

export const errorResult = (error: string) =>
  ({
    isLoading: false,
    isError: true,
    isSuccess: false,
    error,
  }) as const;

export const successResult = <T>(data: T) =>
  ({
    isLoading: false,
    isError: false,
    isSuccess: true,
    data,
  }) as const;

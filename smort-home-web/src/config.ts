import { z } from 'zod';

export const config = {
  serverUrl: z.string().parse(import.meta.env.VITE_SERVER_URL),
} as const;

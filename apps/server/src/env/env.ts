import { z } from 'zod';

export const envSchema = z.object({
  HUE_BRIDGE_USER: z.string(),
  HUE_BRIDGE_CLIENT_KEY: z.string(),
  HUE_BRIDGE_ID: z.string(),
  ARDUINO_IP: z.string(),
  HUE_ALARM_ID: z
    .string()
    .transform((id) => [id])
    .or(z.string().array()),
});
export type Env = z.infer<typeof envSchema>;

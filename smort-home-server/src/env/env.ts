import {z} from 'zod';

export const envSchema = z.object({
    HUE_BRIDGE_HOST: z.string(),
    HUE_BRIDGE_PORT: z.string(),
    HUE_BRIDGE_USER: z.string(),
    HUE_BRIDGE_CLIENT_KEY: z.string(),
    HUE_BRIDGE_ID: z.string(),
});
export type Env = z.infer<typeof envSchema>;
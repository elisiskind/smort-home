import { z } from 'zod';

export const lightSchema = z.object({
  type: z.literal('light'),
  id: z.string(),
  name: z.string(),
  on: z.boolean(),
  dimming: z
    .object({
      brightness: z.number(),
      minDimLevel: z.number().nullable(),
    })
    .nullable(),
  colorTemperature: z
    .object({
      value: z.number(),
      valid: z.boolean(),
      schema: z.object({
        min: z.number(),
        max: z.number(),
      }),
    })
    .nullable(),
});

export type Light = z.infer<typeof lightSchema>;
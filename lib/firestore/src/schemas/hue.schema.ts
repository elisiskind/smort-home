import { z } from 'zod';

export const colorTemperatureSchema = z.object({
  mirek: z.number(),
  mirek_valid: z.boolean(),
  mirek_schema: z.object({
    mirek_minimum: z.number(),
    mirek_maximum: z.number(),
  }),
});

export const dimmingSchema = z.object({
  brightness: z.number(),
  min_dim_level: z.number().optional(),
});

export const onSchema = z.object({
  on: z.boolean(),
});

export const updateSchema = z
  .object({
    on: onSchema,
    dimmingSchema: dimmingSchema.pick({ brightness: true }),
    color_temperature: colorTemperatureSchema.pick({ mirek: true }),
  })
  .partial();

export type HueUpdate = z.infer<typeof updateSchema>;

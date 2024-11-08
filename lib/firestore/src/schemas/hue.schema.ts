import { z } from 'zod';

const colorTemperatureSchema = z.object({
  value: z.number(),
  schema: z
    .object({
      min: z.number(),
      max: z.number(),
    })
    .readonly(),
});

const dimmingSchema = z.object({
  brightness: z.number(),
  minDimLevel: z.number().nullable(),
});

export const lightSchema = z
  .object({
    type: z.literal('light'),
    id: z.string(),
    rid: z.string(),
    name: z.string(),
    on: z.boolean(),
    dimming: dimmingSchema.readonly().nullable(),
    colorTemperature: colorTemperatureSchema.readonly().nullable(),
  })
  .readonly();

export type Light = z.infer<typeof lightSchema>;

export const lightUpdateSchema = z
  .object({
    on: z.boolean().optional(),
    dimming: dimmingSchema.pick({ brightness: true }).readonly().optional(),
    colorTemperature: colorTemperatureSchema
      .pick({ value: true })
      .readonly()
      .optional(),
  })
  .readonly();

export type LightUpdate = z.infer<typeof lightUpdateSchema>;

export const roomSchema = z.object({
  id: z.string(),
  lights: z.array(z.string()),
  name: z.string(),
});

export type Room = z.infer<typeof roomSchema>;

export const behaviorSchema = z.object({
  id: z.string(),
  name: z.string(),
  configuration: z.any(),
  enabled: z.boolean(),
});

export type Behavior = z.infer<typeof behaviorSchema>;

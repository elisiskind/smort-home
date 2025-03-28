import { z } from 'zod';

const colorTemperatureSchema = z.object({
  value: z.number().nullable(),
  schema: z
    .object({
      min: z.number(),
      max: z.number(),
    })
    .readonly(),
});

export type ColorTemperature = z.infer<typeof colorTemperatureSchema>;

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
  group: z
    .object({
      id: z.string(),
      owner: z.string(),
      on: z.boolean(),
      dimming: z.number().nullable(),
    })
    .nullable(),
});

export type Room = z.infer<typeof roomSchema>;

const whenSchema = z.object({
  hour: z.number(),
  minute: z.number(),
  amOrPm: z.enum(['AM', 'PM']),
});

export type When = z.infer<typeof whenSchema>;

export const alarmSchema = z.object({
  id: z.string(),
  name: z.string(),
  when: whenSchema,
  enabled: z.boolean(),
});

export type HueAlarm = z.infer<typeof alarmSchema>;

export const alarmUpdateSchema = z.object({
  when: whenSchema.optional(),
  enabled: z.boolean().optional(),
});

export type HueAlarmUpdate = z.infer<typeof alarmSchema>;

import { z } from 'zod';
import { alarmTriggerSchema, daysOfTheWeek } from './alarm.schema';

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

export const fsHueLightSchema = z
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

export type fsHueLight = z.infer<typeof fsHueLightSchema>;

export const fsHueLightUpdateSchema = z
  .object({
    on: z.boolean().optional(),
    dimming: dimmingSchema.pick({ brightness: true }).readonly().optional(),
    colorTemperature: colorTemperatureSchema
      .pick({ value: true })
      .readonly()
      .optional(),
  })
  .readonly();

export type FsHueLightUpdate = z.infer<typeof fsHueLightUpdateSchema>;

export const fsHueRoomSchema = z.object({
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

export type FsHueRoom = z.infer<typeof fsHueRoomSchema>;

export const fsHueAlarmSchema = z.object({
  id: z.string(),
  name: z.string(),
  trigger: alarmTriggerSchema,
  enabled: z.boolean(),
});

export type FsHueAlarm = z.infer<typeof fsHueAlarmSchema>;

export const fsHueAlarmUpdateSchema = z.object({
  trigger: alarmTriggerSchema.optional(),
  enabled: z.boolean().optional(),
});

export type FsHueAlarmUpdate = z.infer<typeof fsHueAlarmSchema>;

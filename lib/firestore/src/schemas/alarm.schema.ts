import { z } from 'zod';

export const daysOfTheWeek = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

export type DayOfTheWeek = (typeof daysOfTheWeek)[number];

export const alarmTriggerSchema = z.object({
  time: z.object({
    hour: z.number(),
    minute: z.number(),
    amOrPm: z.enum(['am', 'pm']),
  }),
  recurrence: z.array(z.enum(daysOfTheWeek)).readonly(),
});

export type FsAlarmTrigger = z.infer<typeof alarmTriggerSchema>;

export const fsAlarmSchema = z.object({
  trigger: alarmTriggerSchema,
  components: z.array(
    z.object({
      source: z.enum(['hue', 'sonos']),
      id: z.string(),
    }),
  ),
  enabled: z.boolean(),
  synced: z.boolean(),
});

export type FsAlarm = z.infer<typeof fsAlarmSchema>;

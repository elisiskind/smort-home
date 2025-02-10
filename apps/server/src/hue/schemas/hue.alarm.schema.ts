import { z } from 'zod';
import { AlarmTrigger } from '../services/hue.alarm.service';

const behaviorSchema = z
  .object({
    id: z.string(),
    metadata: z.object({
      name: z.string(),
    }),
    configuration: z.any(),
    enabled: z.boolean(),
  })
  .transform(({ metadata, ...behavior }) => ({
    ...behavior,
    name: metadata.name,
  }));

const daysOfTheWeek = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

const withRecurrenceDays = {
  recurrence_days: z.array(z.enum(daysOfTheWeek)),
} as const;

const withTimePoint = {
  time_point: z.object({
    type: z.literal('time'),
    time: z.object({ minute: z.number(), hour: z.number() }),
  }),
} as const;

const configurationSchema = z
  .object({
    when: z.object({
      ...withTimePoint,
      ...withRecurrenceDays,
    }),
  })
  .transform(
    ({ when }) =>
      ({
        amOrPm: when.time_point.time.hour >= 12 ? 'PM' : 'AM',
        hour: ((when.time_point.time.hour + 11) % 12) + 1,
        minute: when.time_point.time.minute,
      }) as const,
  );

export const alarmSchema = (alarmIds: string[]) =>
  z
    .object({
      data: z.array(behaviorSchema),
    })
    .transform(({ data }) => {
      return data
        .filter(({ id }) => alarmIds.includes(id))
        .map(({ configuration, ...data }) => ({
          ...data,
          when: configurationSchema.parse(configuration),
        }));
    });

export const hueAlarmEventSchema = (alarmIds: string[]) =>
  z
    .object({
      id: z.string(),
      enabled: z.boolean().optional(),
      configuration: z.any().optional(),
      metadata: z
        .object({
          name: z.string(),
        })
        .optional(),
    })
    .passthrough()
    .transform(({ id, configuration, enabled, metadata }) => {
      if (alarmIds.includes(id)) {
        return {
          ignore: false,
          id,
          enabled: enabled ?? null,
          name: metadata ? metadata.name : null,
          when: configuration ? configurationSchema.parse(configuration) : null,
        } as const;
      } else {
        return {
          ignore: true,
        } as const;
      }
    })
    .readonly();

export type HueAlarmUpdateEvent = {
  id: string;
  enabled: boolean | null;
  when: AlarmTrigger | null;
  name: string | null;
};

import { z } from 'zod';
import { daysOfTheWeek } from '@smort-home/firestore';
import { AlarmTrigger } from '../../alarms/alarms.service';

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
        time: {
          amOrPm: when.time_point.time.hour >= 12 ? 'pm' : 'am',
          hour: ((when.time_point.time.hour + 11) % 12) + 1,
          minute: when.time_point.time.minute,
        },
        recurrence: when.recurrence_days,
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
          trigger: configurationSchema.parse(configuration),
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
          trigger: configuration
            ? configurationSchema.parse(configuration)
            : null,
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
  trigger: AlarmTrigger | null;
  name: string | null;
};

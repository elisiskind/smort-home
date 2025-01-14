import { z } from 'zod';

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

export const behaviorsSchema = z
  .object({
    data: z.array(behaviorSchema),
  })
  .transform(({ data }) => {
    return data
      .filter((entry) => Object.keys(entry.configuration))
      .filter(
        (data) =>
          'when_extended' in data.configuration || 'when' in data.configuration,
      )
      .map(({ configuration, ...data }) => {
        const when = z
          .union([
            z
              .object({
                when_extended: z.object({
                  ...withRecurrenceDays,
                  start_at: z.object({
                    ...withTimePoint,
                  }),
                }),
              })
              .transform(
                ({ when_extended }) =>
                  ({
                    time: when_extended.start_at.time_point.time,
                    days: when_extended.recurrence_days,
                    type: 'when_extended',
                  }) as const,
              ),
            z
              .object({
                when: z.object({
                  ...withTimePoint,
                  ...withRecurrenceDays,
                }),
              })
              .transform(
                ({ when }) =>
                  ({
                    time: when.time_point.time,
                    days: when.recurrence_days,
                    type: 'when',
                  }) as const,
              ),
          ])
          .parse(configuration);

        return {
          ...data,
          when,
        };
      });
  });

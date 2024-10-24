import { z } from 'zod';

const createEventSchema = <T extends string, D extends z.ZodTypeAny>(
  event: T,
  dataSchema: D,
) =>
  z.object({
    type: z.literal(event),
    handled: z.boolean(dataSchema),
    data: dataSchema,
  });

export const sonosPlaybackEventSchema = createEventSchema(
  'sonos.playback',
  z.object({
    id: z.string(),
    state: z.enum(['PLAY', 'PAUSE']),
  }),
);

export type SonosPlaybackEvent = z.infer<
  typeof sonosPlaybackEventSchema
>['data'];

export const hueLightEventSchema = createEventSchema(
  'hue.light',
  z.object({
    id: z.string(),
    state: z.object({
      on: z.object({
        on: z.boolean(),
      }),
    }),
  }),
);

export type HueLightEvent = z.infer<typeof hueLightEventSchema>['data'];

export const eventSchema = z.discriminatedUnion('type', [
  sonosPlaybackEventSchema,
  hueLightEventSchema,
]);

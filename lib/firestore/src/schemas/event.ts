import { z } from 'zod';

export const sonosPlaybackEventSchema = z.object({
  type: z.literal('sonos.playback'),
  data: z.object({
    id: z.string(),
    state: z.enum(['PLAY', 'PAUSE']),
  }),
});

export type SonosPlaybackEvent = z.infer<typeof sonosPlaybackEventSchema>;

export const hueLightEventSchema = z.object({
  type: z.literal('hue.light'),
  data: z.object({
    id: z.string(),
    state: z.object({
      on: z.object({
        on: z.boolean(),
      }),
    }),
  }),
});

export const eventSchema = z.discriminatedUnion('type', [
  sonosPlaybackEventSchema,
]);

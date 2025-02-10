import { z } from 'zod';
import { alarmUpdateSchema, lightUpdateSchema } from '@smort-home/firestore';

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
    state: lightUpdateSchema,
  }),
);

export type LightEvent = z.infer<typeof hueLightEventSchema>['data'];

export const hueAlarmEventSchema = createEventSchema(
  'hue.alarm',
  z.object({
    id: z.string(),
    state: alarmUpdateSchema,
  }),
);

export type AlarmEvent = z.infer<typeof hueAlarmEventSchema>['data'];

export const antiBeanSprayEventSchema = createEventSchema(
  'antibean.spray',
  z.number(),
);

export const appEventSchema = z.discriminatedUnion('type', [
  sonosPlaybackEventSchema,
  hueLightEventSchema,
  hueAlarmEventSchema,
  antiBeanSprayEventSchema,
]);

export type AppEvent = z.infer<typeof appEventSchema>;

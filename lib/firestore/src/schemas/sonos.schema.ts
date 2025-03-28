import { z } from 'zod';
import { alarmTriggerSchema } from './alarm.schema';

export const fsSonosDeviceSchema = z.object({
  id: z.string(),
  name: z.string(),
  state: z.enum(['PLAYING', 'PAUSED', 'TRANSITIONING', 'STOPPED']),
  nowPlaying: z
    .object({
      title: z.string().nullable(),
      album: z.string().nullable(),
      artist: z.string().nullable(),
      artUrl: z.string().nullable(),
    })
    .transform((nowPlaying) =>
      nowPlaying.album === null &&
      nowPlaying.title === null &&
      nowPlaying.artist === null &&
      nowPlaying.artUrl === null
        ? null
        : nowPlaying,
    )
    .nullable(),
});

export type FsSonosDevice = z.infer<typeof fsSonosDeviceSchema>;

export const fsSonosAlarmSchema = z.object({
  trigger: alarmTriggerSchema,
  duration: z.string(),
  id: z.string(),
  enabled: z.boolean(),
  music: z.object({
    title: z.string(),
    art: z.string().nullable(),
  }),
});

export type FsSonosAlarm = z.infer<typeof fsSonosAlarmSchema>;

export const fsSonosAlarmUpdateSchema = z.object({
  id: z.string(),
  trigger: alarmTriggerSchema.optional(),
  enabled: z.boolean().optional(),
});

export type FsSonosAlarmUpdate = z.infer<typeof fsSonosAlarmSchema>;

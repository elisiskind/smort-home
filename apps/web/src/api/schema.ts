import { z } from 'zod';

export const lightSchema = z.object({
  id: z.string(),
  rid: z.string(),
  name: z.string(),
  on: z.boolean(),
  dimming: z
    .object({
      brightness: z.number(),
    })
    .nullable(),
});

export type Light = z.infer<typeof lightSchema>;

export const roomSchema = z.object({
  id: z.string(),
  lights: z.array(z.string()),
  name: z.string(),
});

export const sonosDeviceSchema = z.object({
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

export type SonosDevice = z.infer<typeof sonosDeviceSchema>;

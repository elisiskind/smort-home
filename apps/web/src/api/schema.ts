import { z } from 'zod';

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

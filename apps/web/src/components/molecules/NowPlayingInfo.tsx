import { Box, Stack } from '@mui/joy';
import { FsSonosDevice } from '../../../../../lib/firestore/src/schemas/sonos.schema';

interface NowPlayingInfoProps {
  nowPlaying: Omit<NonNullable<FsSonosDevice['nowPlaying']>, 'artUrl'>;
}

export const NowPlayingInfo = ({ nowPlaying }: NowPlayingInfoProps) => {
  return (
    <Stack>
      {nowPlaying.title !== null && <Box>{nowPlaying.title}</Box>}
      <Box>{[nowPlaying.artist, nowPlaying.album].join(' • ')}</Box>
    </Stack>
  );
};

import { Box, Stack } from '@mui/joy';
import { SonosDevice } from '../../api/schema';

interface NowPlayingInfoProps {
  nowPlaying: Omit<NonNullable<SonosDevice['nowPlaying']>, 'artUrl'>;
}

export const NowPlayingInfo = ({ nowPlaying }: NowPlayingInfoProps) => {
  return (
    <Stack>
      {nowPlaying.title !== null && <Box>{nowPlaying.title}</Box>}
      <Box>{[nowPlaying.artist, nowPlaying.album].join(' • ')}</Box>
    </Stack>
  );
};

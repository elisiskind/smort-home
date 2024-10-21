import { Box, Card, Stack, Typography } from '@mui/joy';
import { MusicNote } from '@mui/icons-material';
import { NowPlayingInfo } from '../molecules/NowPlayingInfo';
import { SonosDevice } from '../../api/schema';

interface SonosDeviceCardProps {
  device: SonosDevice;
}

export const SonosDeviceCard = ({ device }: SonosDeviceCardProps) => (
  <Card>
    <Stack gap={2}>
      <Typography component={'h3'}>{device.name}</Typography>
      <Stack
        direction={'row'}
        gap={1}
        alignItems={'center'}
        sx={{
          '&>.album-art': {
            height: 96,
            width: 96,
            border: '1px solid lightgray',
            borderRadius: 8,
          },
        }}
      >
        {device.nowPlaying?.artUrl ? (
          <img
            className={'album-art'}
            src={device.nowPlaying.artUrl}
            alt={[device.nowPlaying.album, 'cover art'].join(' ')}
          />
        ) : (
          <MusicNote className={'album-art'} />
        )}
        {device.nowPlaying ? (
          <NowPlayingInfo nowPlaying={device.nowPlaying} />
        ) : (
          <Box>Not playing</Box>
        )}
      </Stack>
    </Stack>
  </Card>
);

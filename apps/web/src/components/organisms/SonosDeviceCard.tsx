import { Box, Card, Stack, Typography } from '@mui/joy';
import { NowPlayingInfo } from '../molecules/NowPlayingInfo';
import { SonosDevice } from '../../api/schema';
import { MusicNote } from '../atoms/MusicNote';

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
          <Box
            bgcolor={'background.level1'}
            className={'album-art'}
            display={'flex'}
            alignItems={'center'}
            justifyContent={'center'}
          >
            <MusicNote height={'64'} width={64} />
          </Box>
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

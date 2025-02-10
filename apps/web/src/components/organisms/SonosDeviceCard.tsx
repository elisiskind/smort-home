import { Box, Button, Card, Stack, Typography } from '@mui/joy';
import { NowPlayingInfo } from '../molecules/NowPlayingInfo';
import { SonosDevice } from '../../api/schema';
import { MusicNote } from '../atoms/MusicNote';
import { updatePlaybackState } from '../../events/sonosEvents';

interface SonosDeviceCardProps {
  device: SonosDevice;
}

export const SonosDeviceCard = ({ device }: SonosDeviceCardProps) => {
  const playingOrPaused =
    device.nowPlaying &&
    (device.state === 'PAUSED' || device.state === 'PLAYING');

  return (
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
              borderRadius: 8,
              padding: 0,
              margin: 0,
              '&>*': {
                height: 96,
                width: 96,
                borderRadius: 8,
              },
              '&:before': playingOrPaused
                ? {
                    fontSize: 32,
                    content: device.state === 'PAUSED' ? '"⏵"' : '"⏸"',
                    position: 'absolute',
                    height: 96,
                    width: 96,
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'black',
                    background: 'white',
                    opacity: 0,
                    transition: 'opacity 0.2s ease-in-out',
                  }
                : undefined,
              '&:hover': playingOrPaused
                ? {
                    '&:before': {
                      opacity: 0.8,
                    },
                  }
                : undefined,
            },
          }}
        >
          <Button
            className={'album-art'}
            onClick={() => {
              updatePlaybackState({
                id: device.id,
                state: device.state === 'PLAYING' ? 'PAUSE' : 'PLAY',
              });
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
          </Button>
          {device.nowPlaying ? (
            <NowPlayingInfo nowPlaying={device.nowPlaying} />
          ) : (
            <Box>Not playing</Box>
          )}
        </Stack>
      </Stack>
    </Card>
  );
};

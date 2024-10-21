import { Meta, StoryObj } from '@storybook/react';
import { SonosDeviceCard } from './SonosDeviceCard';
import Grid from '@mui/joy/Grid';

const meta: Meta = {
  component: SonosDeviceCard,
  decorators: (Story) => (
    <Grid container>
      <Grid xs={4}>
        <Story />
      </Grid>
    </Grid>
  ),
};

export default meta;

export const Default: StoryObj<typeof SonosDeviceCard> = {
  args: {
    device: {
      id: '0',
      name: 'Living Room',
      state: 'PAUSED',
      nowPlaying: {
        title: 'Ice Cream Piano',
        artist: 'Vampire Weekend',
        album: 'Only God Was Above Us',
        artUrl:
          'http://192.168.68.66:1400/getaa?s=1&u=x-sonos-spotify%3aspotify%253atrack%253a19aa6Goj4OAsZUX8hSt6nW%3fsid%3d12%26flags%3d8232%26sn%3d2',
      },
    },
  },
};

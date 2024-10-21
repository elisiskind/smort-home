import { Meta, StoryObj } from '@storybook/react';
import { NowPlayingInfo } from './NowPlayingInfo';

const meta: Meta = {
  component: NowPlayingInfo,
};

export default meta;

export const Default: StoryObj<typeof NowPlayingInfo> = {
  args: {
    nowPlaying: {
      title: 'Ice Cream Piano',
      artist: 'Vampire Weekend',
      album: 'Only God Was Above Us',
    },
  },
};

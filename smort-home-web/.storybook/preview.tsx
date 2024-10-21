import type { Preview } from '@storybook/react';
import { CssBaseline } from '@mui/joy';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: (Story) => (
    <>
      <CssBaseline />
      <Story />
    </>
  ),
};

export default preview;

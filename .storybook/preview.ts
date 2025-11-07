import type { Preview } from '@storybook/html-vite';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      story: {
        height: '500px',
      },
    },
    layout: 'padded',
  },
};

export default preview;

import type { Preview } from '@storybook/react-vite';
// Import CropperJS to register web components
// Required in Storybook since stories import components directly from source
import 'cropperjs';

const preview: Preview = {
  parameters: {
    a11y: {
      test: 'error',
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;

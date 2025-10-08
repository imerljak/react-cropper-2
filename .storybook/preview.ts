import type { Preview } from '@storybook/react-vite'
// Import CropperJS to register web components
import 'cropperjs';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
};

export default preview;
import type { StorybookConfig } from '@storybook/react-vite';
import type { UserConfig } from 'vite';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-docs",
    "@storybook/addon-onboarding",
    "@storybook/addon-vitest"
  ],
  "framework": {
    "name": "@storybook/react-vite",
    "options": {}
  },
  async viteFinal(config: UserConfig) {
    // Remove vite-plugin-dts from Storybook builds
    // Storybook doesn't need TypeScript declarations
    if (config.plugins) {
      config.plugins = config.plugins.filter((plugin) => {
        if (plugin && typeof plugin === 'object' && 'name' in plugin) {
          return plugin.name !== 'vite:dts';
        }
        return true;
      });
    }
    return config;
  }
};
export default config;
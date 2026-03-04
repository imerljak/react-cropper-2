import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, '../../src'),
    },
  },
  root: resolve(__dirname),
  server: {
    port: 3001,
    open: true,
  },
});

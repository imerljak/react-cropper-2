import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'json-summary', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        'dist/',
        '**/*.test.ts',
        '**/*.test.tsx',
        'examples/',
        '*.config.ts',
        '**/*.config.ts',
        '.eslintrc.cjs',
        'src/index.ts', // Main export file - just re-exports
        'src/types/**', // Type definitions only
        '**/*.d.ts',
        '.storybook/**', // Storybook config
        'src/stories/**', // Storybook stories
        'storybook-static/**', // Storybook build output
      ],
      thresholds: {
        lines: 95,
        branches: 85, // Lower threshold due to requestAnimationFrame timing edge cases
        statements: 95,
        // Note: Functions threshold not set globally due to useImperativeHandle
        // creating functions that aren't called in tests
      },
    },
    // Watch mode configuration
    watch: false,
    // Test isolation
    isolate: true,
    // Parallel execution
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});

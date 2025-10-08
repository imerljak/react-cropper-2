import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // In dev mode, serve the example app
  if (mode === 'development') {
    return {
      plugins: [react()],
      resolve: {
        alias: {
          '@': resolve(__dirname, './src'),
        },
      },
      root: resolve(__dirname, 'examples/basic'),
      server: {
        port: 5173,
        open: true,
      },
    };
  }

  // In build mode, build the library
  return {
    plugins: [
      react(),
      dts({
        include: ['src/**/*'],
        exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
        rollupTypes: true,
      }),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'ReactCropper2',
        formats: ['es', 'cjs'],
        fileName: (format) => {
          if (format === 'es') return 'index.js';
          if (format === 'cjs') return 'index.cjs';
          return `index.${format}.js`;
        },
      },
      rollupOptions: {
        external: ['react', 'react-dom', 'react/jsx-runtime', 'cropperjs'],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            'react/jsx-runtime': 'jsxRuntime',
            cropperjs: 'CropperJS',
          },
          // Preserve module structure for better tree-shaking
          preserveModules: false,
          exports: 'named',
        },
      },
      sourcemap: true,
      // Ensure compatibility with older bundlers
      target: 'es2020',
      minify: 'esbuild',
    },
  };
});

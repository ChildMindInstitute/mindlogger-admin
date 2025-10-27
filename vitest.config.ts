import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-macros'],
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts', 'dotenv/config'],
    globalSetup: './src/vitest.global-setup.ts',
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/setupTests.ts'],
    },
    reporters: ['default'],
  },
  resolve: {
    alias: {
      src: resolve(__dirname, 'src'),
      api: resolve(__dirname, 'src/api'),
      assets: resolve(__dirname, 'src/assets'),
      modules: resolve(__dirname, 'src/modules'),
      redux: resolve(__dirname, 'src/redux'),
      resources: resolve(__dirname, 'src/resources'),
      routes: resolve(__dirname, 'src/routes'),
      shared: resolve(__dirname, 'src/shared'),
      svgSprite: resolve(__dirname, 'src/svgSprite'),
      i18n: resolve(__dirname, 'src/i18n'),
      __mocks__: resolve(__dirname, 'src/__mocks__'),
    },
  },
});

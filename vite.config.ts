import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-macros'],
      },
    }),
    tsconfigPaths(),
    svgr(),
    nodePolyfills({
      // Whether to polyfill `node:` protocol imports.
      protocolImports: true,
      globals: {
        Buffer: true,
        process: true,
      },
    }),
  ],
  // Add custom env variable prefix configuration
  envPrefix: 'REACT_APP_',
  build: {
    sourcemap: true,
  },
  server: {
    port: 3000, // Match CRA's default port
    open: true,
  },
  resolve: {
    // Use tsconfig paths for module resolution
    alias: {
      // Add polyfill aliases
      stream: 'stream-browserify',
      crypto: 'crypto-browserify',
    },
    dedupe: ['react', 'react-dom', 'redux', '@reduxjs/toolkit'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@reduxjs/toolkit'],
    exclude: [],
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
    },
  },
});

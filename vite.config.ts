import { defineConfig, loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import sourcemaps from 'rollup-plugin-sourcemaps';

const SECURE_STORAGE_HASH_KEY = 'REACT_APP_SECURE_LOCAL_STORAGE_HASH_KEY';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), 'REACT_APP_');

  // Left unset, react-secure-storage encrypts with a constant published inside its own npm package,
  // identical for every application using the library.
  if (command === 'build' && !env[SECURE_STORAGE_HASH_KEY]) {
    throw new Error(`Missing required environment variable ${SECURE_STORAGE_HASH_KEY}`);
  }

  return {
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
    // The library reads its key off process.env, which the browser does not have. Inlined here
    // rather than left to the polyfill above, whose process.env is empty.
    define: {
      [`process.env.${SECURE_STORAGE_HASH_KEY}`]: JSON.stringify(
        env[SECURE_STORAGE_HASH_KEY] ?? '',
      ),
    },
    build: {
      sourcemap: true,
      rollupOptions: {
        output: {
          sourcemap: true,
          sourcemapExcludeSources: false,
        },
        plugins: [sourcemaps()], // enable if deps ship external maps that aren’t picked up
      },
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
      include: [
        'react',
        'react-dom',
        '@reduxjs/toolkit',
        'react-window',
        'react-virtualized-auto-sizer',
      ],
      exclude: [],
      esbuildOptions: {
        // Node.js global to browser globalThis
        define: {
          global: 'globalThis',
        },
      },
    },
    ssr: {
      noExternal: ['react-window', 'react-virtualized-auto-sizer'],
    },
  };
});

import { defineConfig, devices } from '@playwright/test';
import {runtimeConfig} from './tests/config'


export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL,
    trace: 'on-first-retry', // Collect trace when retrying failed tests
    headless: true,
  },

  globalSetup: 'tests/setup/global.setup.ts',

  reporter: process.env.CI ? 'github' : 'list',

  projects: [
    { name: 'setup', testMatch: /setup\/admin\.setup\.ts/ }, // TODO Change this when there are more roles
    { name: 'auth teardown', testMatch: /setup\/auth\.teardown\.ts/ },

    {
      name: 'smoke',
      testMatch: 'smoke/**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        storageState: runtimeConfig.adminTokenFile,
      },
      dependencies: ['setup'],
      teardown: 'auth teardown'
    },
    // {
    //   name: 'e2e',
    //   testMatch: 'e2e/**/*.spec.ts',
    //   use: {
    //     ...devices['Desktop Chrome'],
    //     storageState: runtimeConfig.storageState,
    //   }
    // },
    // {
    //   name: 'user',
    //   testMatch: 'user/**/*.spec.ts',
    //   use: {
    //     ...devices['Desktop Chrome'],
    //     storageState: runtimeConfig.storageState,
    //   }
    // },

  ],
});

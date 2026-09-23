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

    {
      name: 'smoke',
      testMatch: 'smoke/**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        storageState: runtimeConfig.storageState,
      },
      dependencies: ['setup']
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

    //TODO: Enable other browsers when needed.
    //At the moment all browsers but Chrome fail.
    //
    // {
    //   // Project for Firefox browser
    //   name: 'firefox',
    //   testMatch: /.*\.spec\.ts/,
    //   use: {
    //     ...devices['Desktop Firefox'],
    //     // Use prepared auth state.
    //     storageState: authFile,
    //   },
    //   dependencies: ['setup'],
    // },
    // // Project for Safari browser
    // {
    //   name: 'safari',
    //   testMatch: /.*\.spec\.ts/,
    //   use: {
    //     ...devices['Desktop Safari'],
    //     // Use prepared auth state.
    //     storageState: authFile,
    //   },
    //   dependencies: ['setup'],
    // },
  ],
});

import dotenv from "dotenv";

import {generateStorageFilename} from './utils/file'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 * See https://playwright.dev/docs/test-configuration.
 */
dotenv.config({
  path: `.env`,
});



export const runtimeConfig = {
  storageRoot: 'storage',
  storageState: process.env.PLAYWRIGHT_STORAGE_STATE || 'storage/default.json',
  baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
  apiBaseURL: process.env.PLAYWRIGHT_API_BASE_URL || 'http://localhost:3000',

  userEmail: process.env.PLAYWRIGHT_USER_EMAIL || 'mindlogger',
  userPassword: process.env.PLAYWRIGHT_USER_PASSWORD || 'DefaultPassword123!',

  adminUserEmail: process.env.PLAYWRIGHT_ADMIN_USER_EMAIL || 'mindlogger',
  adminUserPassword: process.env.PLAYWRIGHT_ADMIN_USER_PASSWORD || 'DefaultPassword123!',

  genericEmail: process.env.PLAYWRIGHT_GENERIC_PASSWORD || "someuser@email.com",
  genericUserPassword: process.env.PLAYWRIGHT_GENERIC_PASSWORD || 'DefaultPassword123!',

  userTokenFile: generateStorageFilename('storage','.auth', 'usertoken.json'),
  adminTokenFile: generateStorageFilename('storage','.auth', 'admintoken.json')
}

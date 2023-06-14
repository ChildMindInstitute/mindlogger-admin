import { ServerUrlOption } from './api.types';

// TODO: Move to .env
const PROD_SERVER = 'https://api-dev.cmiml.net';
const STAGING_SERVER = 'https://api-dev.cmiml.net';
const DEV_SERVER = 'https://api-dev.cmiml.net';

export const DEFAULT_CONFIG = {
  headers: {
    'Mindlogger-Content-Source': 'admin',
  },
};

export const BASE_API_URL = process.env.NODE_ENV === 'production' ? PROD_SERVER : STAGING_SERVER;

export const BACKEND_SERVERS: ServerUrlOption[] = [
  {
    name: 'MindLogger (api.mindlogger.org)',
    value: PROD_SERVER,
  },
  {
    name: 'MindLogger development (api-dev.mindlogger.org)',
    value: DEV_SERVER,
  },
  {
    name: 'MindLogger staging (api-staging.mindlogger.org)',
    value: STAGING_SERVER,
  },
  {
    name: 'localhost (localhost:8080)',
    value: 'http://localhost:8080/api/v1',
  },
  {
    name: 'admin new',
    value: 'https://api-new.mindlogger.org/api/v1',
  },
];

export const LANGUAGES: { en: string; fr: string } = {
  en: 'en_US',
  fr: 'fr_FR',
};

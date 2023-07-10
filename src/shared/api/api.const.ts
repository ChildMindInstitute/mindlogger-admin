import { ServerUrlOption } from './api.types';

export const DEFAULT_CONFIG = {
  headers: {
    'Mindlogger-Content-Source': 'admin',
  },
};

export const BASE_API_URL = process.env.REACT_APP_API_DOMAIN || process.env.API_DOMAIN;

export const BACKEND_SERVERS: ServerUrlOption[] = [
  // TODO: fill values if needed from env
  // {
  //   name: 'MindLogger (api.mindlogger.org)',
  //   value: 'PROD_SERVER',
  // },
  // {
  //   name: 'MindLogger development (api-dev.mindlogger.org)',
  //   value: DEV_SERVER,
  // },
  // {
  //   name: 'MindLogger staging (api-staging.mindlogger.org)',
  //   value: STAGING_SERVER,
  // },
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

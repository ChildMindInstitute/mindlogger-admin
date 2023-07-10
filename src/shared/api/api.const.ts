import { ServerUrlOption } from './api.types';

export const DEFAULT_CONFIG = {
  headers: {
    'Mindlogger-Content-Source': 'admin',
  },
};

export const BASE_API_URL = process.env.REACT_APP_API_DOMAIN || process.env.API_DOMAIN;

export const BACKEND_SERVERS: ServerUrlOption[] = [
  {
    name: 'MindLogger (api.mindlogger.org)',
    value: 'https://api.mindlogger.org/api/v1',
  },
  {
    name: 'MindLogger development (api-dev.cmiml.net)',
    value: 'https://api-dev.cmiml.net',
  },
  {
    name: 'MindLogger staging (api-staging.mindlogger.org)',
    value: 'http://api-staging.mindlogger.org/api/v1',
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

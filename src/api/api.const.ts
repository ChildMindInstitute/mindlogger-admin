const PROD_SERVER = 'https://api.mindlogger.org/api/v1';
const STAGING_SERVER = 'https://api-staging.mindlogger.org/api/v1';
const DEV_SERVER = 'https://api-dev.mindlogger.org/api/v1';

export type ServerUrlOption = {
  name: string;
  value: string;
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

// TODO: Move to .env
const PROD_SERVER = 'https://api-dev.cmiml.net';
const STAGING_SERVER = 'https://api-staging.mindlogger.org/api/v1';

export const BASE_API_URL = process.env.NODE_ENV === 'production' ? PROD_SERVER : STAGING_SERVER;

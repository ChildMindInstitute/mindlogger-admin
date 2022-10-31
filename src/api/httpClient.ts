import axios, { AxiosRequestConfig } from 'axios';

const httpClient = axios.create({
  // TODO: Move to .env and make it changeable due to chosen host in dropdown
  baseURL: 'https://api-staging.mindlogger.org/api/v1',
  timeout: 0,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.request.use((config: AxiosRequestConfig) => {
  const url = config.url || '';
  const URLs = [
    '/user/me',
    '/user/accounts',
    '/user/switchAccount',
    '/theme',
    '/account/users',
    '/library/categories',
  ];

  if (!config.headers) {
    config.headers = {};
  }

  if (URLs.some((item) => url.includes(item))) {
    config.headers['Girder-Token'] = sessionStorage.getItem('accessToken');
  }

  return config;
});

export { httpClient };

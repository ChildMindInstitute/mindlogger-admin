import axios, { AxiosRequestConfig } from 'axios';

import { getBaseUrl } from './api.func';

export const authApiClient = axios.create();
export const apiClient = axios.create();
export const apiClientWithLang = axios.create();

[apiClient, apiClientWithLang].forEach((client) =>
  client.interceptors.request.use((config: AxiosRequestConfig) => {
    config.baseURL = getBaseUrl();

    return config;
  }),
);

apiClientWithLang.interceptors.request.use((config: AxiosRequestConfig) => {
  if (!config.params) {
    config.params = {};
  }
  config.params.lang = sessionStorage.getItem('lang') || 'en';

  return config;
});

authApiClient.interceptors.request.use((config: AxiosRequestConfig) => {
  if (!config.headers) {
    config.headers = {};
  }
  config.baseURL = getBaseUrl();
  config.headers['Girder-Token'] = sessionStorage.getItem('accessToken');

  return config;
});

import axios, { AxiosRequestConfig } from 'axios';

import {
  getBaseUrl,
  getRequestFullLangData,
  getRequestLangData,
  getRequestTokenData,
} from './api.utils';

export const authApiClient = axios.create();
export const apiClient = axios.create();
export const apiClientWithLang = axios.create();
export const authApiClientWithFullLang = axios.create();

[apiClient, apiClientWithLang, authApiClient, authApiClientWithFullLang].forEach((client) =>
  client.interceptors.request.use((config: AxiosRequestConfig) => {
    config.baseURL = getBaseUrl();

    return config;
  }),
);

apiClientWithLang.interceptors.request.use((config: AxiosRequestConfig) => {
  getRequestLangData(config);

  return config;
});

authApiClient.interceptors.request.use((config: AxiosRequestConfig) => {
  getRequestTokenData(config);

  return config;
});

authApiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401) {
      return getRequestTokenData(error);
    } else {
      return Promise.reject(error);
    }
  },
);

authApiClientWithFullLang.interceptors.request.use((config: AxiosRequestConfig) => {
  getRequestTokenData(config);
  getRequestFullLangData(config);

  return config;
});

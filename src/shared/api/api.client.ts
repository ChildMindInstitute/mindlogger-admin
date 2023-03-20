import axios, { AxiosRequestConfig } from 'axios';

import {
  getBaseUrl,
  getRequestFullLangData,
  getRequestLangData,
  getRequestTokenData,
  refreshTokenAndReattemptRequest,
} from './api.utils';
import { DEFAULT_CONFIG } from './api.const';

export const authApiClient = axios.create(DEFAULT_CONFIG);
export const apiClient = axios.create(DEFAULT_CONFIG);
export const apiClientWithLang = axios.create(DEFAULT_CONFIG);
export const authApiClientWithFullLang = axios.create(DEFAULT_CONFIG);

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
      return refreshTokenAndReattemptRequest(error);
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

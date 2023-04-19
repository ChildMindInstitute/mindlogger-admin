import axios, { AxiosRequestConfig } from 'axios';

import { getBaseUrl, getRequestTokenData, refreshTokenAndReattemptRequest } from './api.utils';
import { DEFAULT_CONFIG } from './api.const';

export const authApiClient = axios.create(DEFAULT_CONFIG);
export const apiClient = axios.create(DEFAULT_CONFIG);

[apiClient, authApiClient].forEach((client) =>
  client.interceptors.request.use((config: AxiosRequestConfig) => {
    config.baseURL = getBaseUrl();

    return config;
  }),
);

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

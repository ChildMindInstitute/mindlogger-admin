import axios, { InternalAxiosRequestConfig } from 'axios';

import { ApiResponseCodes, DEFAULT_CONFIG } from './api.const';
import { getCommonConfig, getRequestTokenData, refreshTokenAndReattemptRequest } from './api.utils';

export const apiClient = axios.create(DEFAULT_CONFIG);
export const authApiClient = axios.create(DEFAULT_CONFIG);
export const authApiClientWithoutRefresh = axios.create(DEFAULT_CONFIG);

[apiClient, authApiClient, authApiClientWithoutRefresh].forEach((client) =>
  client.interceptors.request.use((config: InternalAxiosRequestConfig) => getCommonConfig(config)),
);

[authApiClient, authApiClientWithoutRefresh].forEach((client) =>
  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    getRequestTokenData(config);

    return config;
  }),
);

authApiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === ApiResponseCodes.Unauthorized) {
      return refreshTokenAndReattemptRequest(error);
    } else {
      return Promise.reject(error);
    }
  },
);

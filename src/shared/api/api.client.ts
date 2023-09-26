import axios, { AxiosRequestConfig } from 'axios';

import { getCommonConfig, getRequestTokenData, refreshTokenAndReattemptRequest } from './api.utils';
import { ApiResponseCodes, DEFAULT_CONFIG } from './api.const';

export const apiClient = axios.create(DEFAULT_CONFIG);
export const authApiClient = axios.create(DEFAULT_CONFIG);
export const authApiClientWithoutRefresh = axios.create(DEFAULT_CONFIG);

[apiClient, authApiClient, authApiClientWithoutRefresh].forEach((client) =>
  client.interceptors.request.use((config: AxiosRequestConfig) => getCommonConfig(config)),
);

[authApiClient, authApiClientWithoutRefresh].forEach((client) =>
  client.interceptors.request.use((config: AxiosRequestConfig) => {
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

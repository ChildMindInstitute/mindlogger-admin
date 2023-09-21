import { AxiosRequestConfig } from 'axios';

import { getBaseUrl, getRequestTokenData, refreshTokenAndReattemptRequest } from './api.utils';
import { ApiResponseCodes } from './api.const';
import { apiClient, authApiClient, authApiClientWithoutRefresh } from './api';

[apiClient, authApiClient, authApiClientWithoutRefresh].forEach((client) =>
  client.interceptors.request.use((config: AxiosRequestConfig) => {
    config.baseURL = getBaseUrl();

    return config;
  }),
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

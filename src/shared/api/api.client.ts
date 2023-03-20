import { AxiosRequestConfig } from 'axios';

import {
  apiClient,
  apiClientWithLang,
  authApiClient,
  authApiClientWithFullLang,
} from './api.const';
import {
  getBaseUrl,
  getRequestFullLangData,
  getRequestLangData,
  getRequestTokenData,
  refreshTokenAndReattemptRequest,
} from './api.utils';

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

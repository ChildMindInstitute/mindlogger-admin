import axios, { AxiosRequestConfig } from 'axios';

import { getBaseUrl } from 'shared/api';

export const apiClient = axios.create();

apiClient.interceptors.request.use((config: AxiosRequestConfig) => {
  config.baseURL = getBaseUrl();

  return config;
});

import axios, { AxiosRequestConfig } from 'axios';

import { BASE_API_URL } from 'shared/api';

export const apiClient = axios.create();

apiClient.interceptors.request.use((config: AxiosRequestConfig) => {
  config.baseURL = BASE_API_URL;

  return config;
});

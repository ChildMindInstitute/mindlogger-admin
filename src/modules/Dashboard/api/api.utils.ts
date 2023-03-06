import axios, { AxiosError, AxiosRequestConfig } from 'axios';

import storage from 'utils/storage';

import { signInRefreshTokenApi } from './api';
import { BASE_API_URL, LANGUAGES } from './api.const';

export const getBaseUrl = () => (storage.getItem('apiUrl') as string) || BASE_API_URL;

export const getRequestTokenData = (config: AxiosRequestConfig) => {
  const accessToken = storage.getItem('accessToken');
  if (!config.headers) {
    config.headers = {};
  }
  config.headers['Authorization'] = `bearer ${accessToken}`;
};

export const getRequestLangData = (config: AxiosRequestConfig) => {
  if (!config.params) {
    config.params = {};
  }
  config.params.lang = storage.getItem('lang') || 'en';
};

export const getRequestFullLangData = (config: AxiosRequestConfig) => {
  if (!config.params) config.params = {};
  const lang = (storage.getItem('lang') || 'en') as keyof typeof LANGUAGES;

  config.params.lang = LANGUAGES[lang] as string;
};

export const refreshTokenAndReattemptRequest = async (err: AxiosError) => {
  try {
    const { response: errorResponse } = err;
    const refreshToken = storage.getItem('refreshToken') as string;
    const { data } = await signInRefreshTokenApi({
      refreshToken,
    });

    return new Promise((resolve) => {
      if (data?.result?.accessToken) {
        storage.setItem('accessToken', data.result.accessToken);
        resolve(
          axios({
            ...errorResponse?.config,
            headers: {
              Authorization: `Bearer ${data.result.accessToken}`,
            },
          }),
        );
      }
    });
  } catch (err) {
    return Promise.reject(err);
  }
};

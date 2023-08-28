import axios, { AxiosError, AxiosRequestConfig } from 'axios';

import { authStorage, storage } from 'shared/utils';

import { BASE_API_URL } from './api.const';
import { signInRefreshTokenApi } from './api';

export const getBaseUrl = () => (storage.getItem('apiUrl') as string) || BASE_API_URL || '';

export const getRequestTokenData = (config: AxiosRequestConfig) => {
  const accessToken = authStorage.getAccessToken();
  if (!config.headers) {
    config.headers = {};
  }
  config.headers['Authorization'] = `bearer ${accessToken}`;
};

export const refreshTokenAndReattemptRequest = async (err: AxiosError) => {
  try {
    const { response: errorResponse } = err;
    const refreshToken = authStorage.getRefreshToken();

    const { data } = await signInRefreshTokenApi({
      refreshToken,
    });

    return new Promise((resolve, reject) => {
      if (!data?.result?.accessToken) {
        return reject(new Error('Access token refresh failed.'));
      }

      authStorage.setAccessToken(data.result.accessToken);
      const originalConfig = errorResponse?.config;

      try {
        resolve(
          axios({
            ...originalConfig,
            headers: {
              ...(originalConfig?.headers && originalConfig.headers),
              Authorization: `Bearer ${data.result.accessToken}`,
            },
            ...(originalConfig?.data && { data: JSON.parse(originalConfig.data) }),
          }),
        );
      } catch (error) {
        reject(error);
      }
    });
  } catch (error) {
    return Promise.reject(error);
  }
};

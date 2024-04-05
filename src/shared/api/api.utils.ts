import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

import { authStorage } from 'shared/utils/authStorage';
import { LocalStorageKeys, storage } from 'shared/utils/storage';

import { BASE_API_URL, Languages, regionalLangFormats } from './api.const';
import { signInRefreshTokenApi } from './api';

export const getBaseUrl = () =>
  (storage.getItem(LocalStorageKeys.ApiUrl) as string) || BASE_API_URL || '';

export const getCommonConfig = (config: InternalAxiosRequestConfig) => {
  config.baseURL = getBaseUrl();
  const langFromStorage = storage.getItem(LocalStorageKeys.Language) || Languages.EN;
  config.headers['Content-Language'] =
    regionalLangFormats[langFromStorage as Languages] || (langFromStorage as string);

  return config;
};

export const getRequestTokenData = (config: InternalAxiosRequestConfig) => {
  const accessToken = authStorage.getAccessToken();
  config.headers['Authorization'] = `bearer ${accessToken}`;
};

export const refreshTokenAndReattemptRequest = async (err: AxiosError) => {
  try {
    const { response: errorResponse } = err;
    const oldRefreshToken = authStorage.getRefreshToken();

    const {
      data: { result },
    } = await signInRefreshTokenApi({
      refreshToken: oldRefreshToken,
    });
    const { accessToken, refreshToken } = result ?? {};

    return new Promise((resolve, reject) => {
      if (!accessToken || !refreshToken) {
        return reject(new Error('Access token refresh failed.'));
      }

      authStorage.setAccessToken(accessToken);
      authStorage.setRefreshToken(refreshToken);
      const originalConfig = errorResponse?.config;

      try {
        resolve(
          axios({
            ...originalConfig,
            headers: {
              ...(originalConfig?.headers && originalConfig.headers),
              Authorization: `Bearer ${accessToken}`,
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

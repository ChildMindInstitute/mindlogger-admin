import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

import { authStorage } from 'shared/utils/authStorage';
import { LocalStorageKeys, storage } from 'shared/utils/storage';
import { UiLanguages, regionalLangFormats } from 'shared/ui';
import { getSessionId } from 'shared/hooks/useSessionKeepAlive/sessionSync.utils';
import { publishSessionMessage } from 'shared/hooks/useSessionKeepAlive/sessionSync';

import { apiRoutesToSkip, BASE_API_URL } from './api.const';
import { signInRefreshTokenApi } from './api';

export const getCommonConfig = (config: InternalAxiosRequestConfig) => {
  config.baseURL = BASE_API_URL || '';
  const langFromStorage = storage.getItem(LocalStorageKeys.Language) || UiLanguages.EN;
  config.headers['Content-Language'] =
    regionalLangFormats[langFromStorage as UiLanguages] || langFromStorage;

  return config;
};

export const getRequestTokenData = (config: InternalAxiosRequestConfig) => {
  const accessToken = authStorage.getAccessToken();
  config.headers['Authorization'] = `bearer ${accessToken}`;
};

export const getRefreshTokenData = (config: InternalAxiosRequestConfig) => {
  const refreshToken = authStorage.getRefreshToken();
  config.headers['Authorization'] = `bearer ${refreshToken}`;
};

const requestNewTokens = async () => {
  const {
    data: { result },
  } = await signInRefreshTokenApi({
    refreshToken: authStorage.getRefreshToken(),
  });
  const { accessToken, refreshToken } = result ?? {};

  if (!accessToken || !refreshToken) {
    throw new Error('Access token refresh failed.');
  }

  // Read before the tokens change, since siblings identify by the one they still hold.
  const sessionId = getSessionId();

  authStorage.setAccessToken(accessToken);
  authStorage.setRefreshToken(refreshToken);

  if (sessionId) {
    publishSessionMessage({
      type: 'TOKENS_UPDATED',
      payload: { sessionId, accessToken, refreshToken },
    });
  }

  return { accessToken, refreshToken };
};

let pendingRefresh: ReturnType<typeof requestNewTokens> | null = null;

// Callers that overlap share one request instead of each rotating the token separately.
export const refreshTokens = () => {
  if (!pendingRefresh) {
    pendingRefresh = requestNewTokens().finally(() => {
      pendingRefresh = null;
    });
  }

  return pendingRefresh;
};

let onSessionExpired: (() => void) | null = null;

// The interceptor is module code and cannot reach hooks, so the teardown is registered from a
// component instead.
export const setSessionExpiredHandler = (handler: (() => void) | null) => {
  onSessionExpired = handler;
};

export const refreshTokenAndReattemptRequest = async (err: AxiosError) => {
  let accessToken: string;

  try {
    ({ accessToken } = await refreshTokens());
  } catch (error) {
    // Nobody else owns this failure. Without it the rejection reaches the calling thunk and the
    // tab keeps rendering a signed-in UI over a session the server has already ended.
    onSessionExpired?.();

    throw error;
  }

  const originalConfig = err.response?.config;

  return axios({
    ...originalConfig,
    headers: {
      ...originalConfig?.headers,
      Authorization: `Bearer ${accessToken}`,
    },
    ...(originalConfig?.data && { data: JSON.parse(originalConfig.data) }),
  });
};

export const shouldNotSkipRoute = (url: string) =>
  !apiRoutesToSkip.some((route) => new RegExp(route).test(url));

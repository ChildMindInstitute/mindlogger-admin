import { InternalAxiosRequestConfig } from 'axios';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';

import { forbiddenState } from 'shared/state/ForbiddenState';

import {
  getCommonConfig,
  getRequestTokenData,
  getRefreshTokenData,
  refreshTokenAndReattemptRequest,
} from './api.utils';
import { ApiResponseCodes } from './api.const';
import {
  apiClient,
  authApiClient,
  authApiClientWithoutRefresh,
  authApiClientRemoveRefresh,
} from './apiConfig';

let store: ToolkitStore;
export const injectStoreToApiClient = (injectedStore: ToolkitStore) => {
  store = injectedStore;
};

[apiClient, authApiClient, authApiClientWithoutRefresh, authApiClientRemoveRefresh].forEach(
  (client) =>
    client.interceptors.request.use((config: InternalAxiosRequestConfig) =>
      getCommonConfig(config),
    ),
);

[authApiClient, authApiClientWithoutRefresh].forEach((client) =>
  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    getRequestTokenData(config);

    return config;
  }),
);

authApiClientRemoveRefresh.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  getRefreshTokenData(config);

  return config;
});

authApiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === ApiResponseCodes.Unauthorized) {
      return refreshTokenAndReattemptRequest(error);
    } else if (error.response?.status === ApiResponseCodes.Forbidden) {
      store.dispatch(forbiddenState.actions.addForbiddenError());

      return Promise.reject(error);
    } else {
      return Promise.reject(error);
    }
  },
);

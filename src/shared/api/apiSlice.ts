import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { BASE_API_URL, RefreshResponse, ResponseWithObject } from 'api';
import { regionalLangFormats, UiLanguages } from 'shared/ui';
import { authStorage } from 'shared/utils';
import { LocalStorageKeys, storage } from 'shared/utils/storage';

export const baseQuery = fetchBaseQuery({
  baseUrl: BASE_API_URL,
  prepareHeaders: (headers) => {
    const langFromStorage =
      (storage.getItem(LocalStorageKeys.Language) as UiLanguages) || UiLanguages.EN;
    const token = authStorage.getAccessToken();

    headers.set('Content-Language', regionalLangFormats[langFromStorage] ?? langFromStorage);
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

export const baseQueryWithRefresh: typeof baseQuery = async (args, store, extraOptions) => {
  let result = await baseQuery(args, store, extraOptions);

  if (result.error?.status === 401) {
    const oldAccessToken = authStorage.getAccessToken();
    const oldRefreshToken = authStorage.getRefreshToken();

    if (!oldAccessToken || !oldRefreshToken) return result;

    // Update baseQuery to use refresh token instead of access token
    authStorage.setAccessToken(oldRefreshToken);

    // Try to refresh the token
    const { data } = await baseQuery(
      {
        method: 'POST',
        url: '/auth/token/refresh',
        body: { refreshToken: oldRefreshToken },
      },
      store,
      extraOptions,
    );

    if (data) {
      const {
        result: { accessToken, refreshToken },
      } = data as ResponseWithObject<RefreshResponse>;

      // Store the new tokens
      authStorage.setAccessToken(accessToken);
      authStorage.setRefreshToken(refreshToken);

      // Retry the original request
      result = await baseQuery(args, store, extraOptions);
    } else {
      throw new Error('Access token refresh failed.');
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithRefresh,
  tagTypes: ['Applet', 'Respondent', 'Manager'],
  endpoints: (builder) => ({}),
});

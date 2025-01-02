import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { BASE_API_URL } from 'api';
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

export const apiSlice = createApi({
  reducerPath: 'api',
  // TODO: replace baseQuery with expired access token logic
  baseQuery,
  tagTypes: ['Applet'],
  endpoints: (builder) => ({}),
});

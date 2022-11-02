import { httpClient, authHttpClient } from './httpClient';

import {
  SignIn,
  SignInWithToken,
  SignUpArgs,
  ResetPassword,
  SwitchAccount,
  AccountUserList,
} from './api.types';

const lang = sessionStorage.getItem('lang') || 'en';

export const signInApi = ({ email, password }: SignIn, signal?: AbortSignal) =>
  httpClient.get('user/authentication', {
    headers: { 'Girder-Authorization': `Basic ${window.btoa(`${email}:${password}`)}` },
    params: {
      lang,
    },
    signal,
  });

export const signInWithTokenApi = ({ token }: SignInWithToken, signal?: AbortSignal) =>
  httpClient.get('/user/authentication', {
    headers: {
      'Girder-Token': token,
    },
    params: {
      lang,
    },
    signal,
  });

export const signUpApi = ({ body }: SignUpArgs, signal?: AbortSignal) =>
  httpClient.post(
    '/user',
    { signal },
    {
      params: {
        ...body,
        admin: true,
      },
    },
  );

export const resetPasswordApi = ({ email }: ResetPassword, signal?: AbortSignal) =>
  httpClient.put(
    '/user/password/temporary',
    { signal },
    {
      params: {
        email,
        lang,
      },
    },
  );

export const getUserDetailsApi = (signal?: AbortSignal) =>
  authHttpClient.get('/user/me', { signal });

export const getAccountsApi = (signal?: AbortSignal) =>
  authHttpClient.get('/user/accounts', { signal });

export const switchAccountApi = ({ accountId }: SwitchAccount, signal?: AbortSignal) =>
  authHttpClient.put(
    '/user/switchAccount',
    { signal },
    {
      params: {
        accountId,
      },
    },
  );

export const getThemesApi = (signal?: AbortSignal) => authHttpClient.get('/theme', { signal });

export const getAccountUserListApi = (
  { appletId, role, MRN, pagination, sort }: AccountUserList,
  signal?: AbortSignal,
) =>
  authHttpClient.get('/account/users', {
    params: {
      appletId,
      role,
      MRN,
      pagination,
      sort,
    },
    signal,
  });

export const getLibraryCategoriesApi = (signal?: AbortSignal) =>
  authHttpClient.get('/library/categories', { signal });

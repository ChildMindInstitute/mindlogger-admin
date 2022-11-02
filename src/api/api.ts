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

export const signIn = ({ email, password }: SignIn, signal?: AbortSignal) =>
  httpClient.get('user/authentication', {
    headers: { 'Girder-Authorization': `Basic ${window.btoa(`${email}:${password}`)}` },
    params: {
      lang,
    },
    signal,
  });

export const signInWithToken = ({ token }: SignInWithToken, signal?: AbortSignal) =>
  httpClient.get('/user/authentication', {
    headers: {
      'Girder-Token': token,
    },
    params: {
      lang,
    },
    signal,
  });

export const signUp = ({ body }: SignUpArgs, signal?: AbortSignal) =>
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

export const resetPassword = ({ email }: ResetPassword, signal?: AbortSignal) =>
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

export const getUserDetails = (signal?: AbortSignal) => authHttpClient.get('/user/me', { signal });

export const getAccounts = (signal?: AbortSignal) =>
  authHttpClient.get('/user/accounts', { signal });

export const switchAccount = ({ accountId }: SwitchAccount, signal?: AbortSignal) =>
  authHttpClient.put(
    '/user/switchAccount',
    { signal },
    {
      params: {
        accountId,
      },
    },
  );

export const getThemes = (signal?: AbortSignal) => authHttpClient.get('/theme', { signal });

export const getAccountUserList = (
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

export const getLibraryCategories = (signal?: AbortSignal) =>
  authHttpClient.get('/library/categories', { signal });

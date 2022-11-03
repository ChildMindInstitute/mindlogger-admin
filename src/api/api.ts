import { apiClient, apiClientWithLang, authApiClient } from './api.client';
import {
  SignIn,
  SignInWithToken,
  SignUpArgs,
  ResetPassword,
  SwitchAccount,
  AccountUserList,
} from './api.types';

export const signInApi = ({ email, password }: SignIn, signal?: AbortSignal) =>
  apiClientWithLang.get('user/authentication', {
    headers: { 'Girder-Authorization': `Basic ${window.btoa(`${email}:${password}`)}` },
    signal,
  });

export const signInWithTokenApi = ({ token }: SignInWithToken, signal?: AbortSignal) =>
  apiClientWithLang.get('/user/authentication', {
    headers: {
      'Girder-Token': token,
    },
    signal,
  });

export const signUpApi = ({ body }: SignUpArgs, signal?: AbortSignal) =>
  apiClient.post(
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
  apiClientWithLang.put(
    '/user/password/temporary',
    { signal },
    {
      params: {
        email,
      },
    },
  );

export const getUserDetailsApi = (signal?: AbortSignal) =>
  authApiClient.get('/user/me', { signal });

export const getAccountsApi = (signal?: AbortSignal) =>
  authApiClient.get('/user/accounts', { signal });

export const switchAccountApi = ({ accountId }: SwitchAccount, signal?: AbortSignal) =>
  authApiClient.put(
    '/user/switchAccount',
    { signal },
    {
      params: {
        accountId,
      },
    },
  );

export const getThemesApi = (signal?: AbortSignal) => authApiClient.get('/theme', { signal });

export const getAccountUserListApi = (
  { appletId, role, MRN, pagination, sort }: AccountUserList,
  signal?: AbortSignal,
) =>
  authApiClient.get('/account/users', {
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
  authApiClient.get('/library/categories', { signal });

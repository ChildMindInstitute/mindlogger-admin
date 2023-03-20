import { apiClient, apiClientWithLang } from 'shared/api/api.const';

import { SignIn, SignUpArgs, ResetPassword } from './api.types';

export const signInApi = ({ email, password }: SignIn, signal?: AbortSignal) =>
  apiClientWithLang.post(
    'auth/login',
    { email, password },
    {
      signal,
    },
  );

export const signUpApi = ({ body }: SignUpArgs, signal?: AbortSignal) =>
  apiClient.post(
    '/users',
    { ...body },
    {
      signal,
    },
  );

export const resetPasswordApi = ({ email }: ResetPassword, signal?: AbortSignal) =>
  apiClient.post(
    '/users/me/password/recover',
    { email },
    {
      signal,
    },
  );

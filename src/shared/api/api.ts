import { apiClient } from './api.client';
import { SignInRefreshTokenArgs } from './api.types';

export const signInRefreshTokenApi = (
  { refreshToken }: SignInRefreshTokenArgs,
  signal?: AbortSignal,
) =>
  apiClient.post(
    '/auth/token/refresh',
    { refreshToken },
    {
      signal,
    },
  );

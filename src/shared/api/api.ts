import { apiClient, authApiClient } from './api.client';
import { SignInRefreshTokenArgs, AppletId } from './api.types';

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

export const getWorkspacesApi = (signal?: AbortSignal) =>
  authApiClient.get('/workspaces', {
    signal,
  });

export const getAppletApi = ({ appletId }: AppletId, signal?: AbortSignal) =>
  authApiClient.get(`/applets/${appletId}`, { signal });

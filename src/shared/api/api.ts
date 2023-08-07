import { SingleApplet } from 'shared/state';
import { AlertListParams, OwnerId } from 'api';

import { apiClient, authApiClient } from './api.client';
import { SignInRefreshTokenArgs, AppletId, AppletBody } from './api.types';

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

export const getAppletWithItemsApi = (
  { ownerId, appletId }: OwnerId & AppletId,
  signal?: AbortSignal,
) => authApiClient.get(`/workspaces/${ownerId}/applets/${appletId}`, { signal });

export const putAppletApi = ({ appletId, body }: AppletBody, signal?: AbortSignal) =>
  authApiClient.put(
    `/applets/${appletId}`,
    {
      ...body,
    },
    { signal },
  );

export const postAppletApi = (
  { ownerId, body }: OwnerId & { body: SingleApplet },
  signal?: AbortSignal,
) =>
  authApiClient.post(
    `workspaces/${ownerId}/applets`,
    {
      ...body,
    },
    { signal },
  );

export const postFileUploadApi = (body: FormData, signal?: AbortSignal) =>
  authApiClient.post('/file/upload', body, {
    signal,
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const postFileDownloadApi = (key: string, signal?: AbortSignal) =>
  authApiClient.post(
    '/file/download',
    { key },
    {
      signal,
    },
  );

export const getWorkspaceRolesApi = ({ ownerId }: OwnerId, signal?: AbortSignal) =>
  authApiClient.get(`/workspaces/${ownerId}/roles`, { params: {}, signal });

export const getAlertsApi = (params: AlertListParams, signal?: AbortSignal) =>
  authApiClient.get('/alerts', { params, signal });

export const setAlertWatchedApi = (alertId: string, signal?: AbortSignal) =>
  authApiClient.post(`/alerts/${alertId}/is_watched`, { signal });

import axios from 'axios';

import { SingleApplet } from 'shared/state/Applet';
import { AlertListParams } from 'shared/api/api.types';
import { DEFAULT_CONFIG } from 'shared/api/api.const';
import { OwnerId } from 'modules/Dashboard/api/api.types';

// import { apiClient, authApiClient } from './api.client';
import { SignInRefreshTokenArgs, AppletId, AppletBody } from './api.types';

export const apiClient = axios.create(DEFAULT_CONFIG);
export const authApiClient = axios.create(DEFAULT_CONFIG);
export const authApiClientWithoutRefresh = axios.create(DEFAULT_CONFIG);

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

export const postFilePresignApi = (appletId: string, privateUrls: string[], signal?: AbortSignal) =>
  authApiClient.post(
    `/file/${appletId}/presign`,
    { privateUrls },
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

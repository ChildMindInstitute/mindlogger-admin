import { SingleApplet } from 'shared/state/Applet';
import { AlertListParams, FileUploadUrlResult, RefreshResponse } from 'shared/api/api.types';
import { OwnerId } from 'modules/Dashboard/api/api.types';

import {
  ResponseWithObject,
  SignInRefreshTokenArgs,
  AppletId,
  AppletBody,
  AppletUniqueName,
} from './api.types';
import { apiClient, authApiClient } from './apiConfig';

export const signInRefreshTokenApi = (
  { refreshToken }: SignInRefreshTokenArgs,
  signal?: AbortSignal,
) =>
  apiClient.post<ResponseWithObject<RefreshResponse>>(
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

export const postFileUploadUrlApi = (fileName: string, signal?: AbortSignal) =>
  authApiClient.post<ResponseWithObject<FileUploadUrlResult>>(
    '/file/upload-url',
    { fileName },
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

export const getAppletUniqueNameApi = ({ name }: AppletUniqueName, signal?: AbortSignal) =>
  authApiClient.post(
    '/applets/unique_name',
    { name },
    {
      signal,
    },
  );

export const postLogFile = (
  { deviceId, fileId, file }: { deviceId: string; fileId: string; file: FormData },
  signal?: AbortSignal,
) =>
  authApiClient.post<
    ResponseWithObject<{
      key: `logfiles/${string}`;
      url: string;
      fileId: string;
    }>
  >(`/file/log-file/${deviceId}`, file, {
    params: {
      fileId,
    },
    signal,
  });

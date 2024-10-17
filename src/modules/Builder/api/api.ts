import { AppletId, Response } from 'shared/api/api.types';
import { authApiClient } from 'shared/api/apiConfig';

import {
  SaveIntegrationParams,
  FetchIntegrationProjectsParams,
  GetThemesParams,
  Theme,
  UploadLorisUsersVisitsParams,
  FetchIntegrationStatusParams,
} from './api.types';

export const getThemesApi = (params: GetThemesParams, signal?: AbortSignal) =>
  authApiClient.get<Response<Theme>>('/themes', { params, signal });

export const setLorisIntegrationApi = ({ appletId }: AppletId, signal?: AbortSignal) =>
  authApiClient.post(
    '/integrations/loris/publish',
    {},
    { params: { applet_id: appletId }, signal },
  );

export const getLorisVisitsApi = ({ appletId }: AppletId, signal?: AbortSignal) =>
  authApiClient.get(`/integrations/loris/${appletId}/visits`, { signal });

export const getLorisUsersVisitsApi = ({ appletId }: AppletId, signal?: AbortSignal) =>
  authApiClient.get(`/integrations/loris/${appletId}/users/visits`, { signal });

export const uploadLorisUsersVisitsApi = (
  { appletId, payload }: UploadLorisUsersVisitsParams,
  signal?: AbortSignal,
) =>
  authApiClient.post('/integrations/loris/publish', payload, {
    params: { applet_id: appletId },
    signal,
  });

export const getLorisIntegrationStatus = async (
  params: FetchIntegrationStatusParams,
  signal?: AbortSignal,
) => await authApiClient.get('/integrations', { params, signal });

export const fetchLorisProjectsFromApi = async (
  params: FetchIntegrationProjectsParams,
  signal?: AbortSignal,
) => authApiClient.get(`/integrations/${params.integrationType}/projects`, { params, signal });

export const saveIntegrationToApi = async <T>(
  params: SaveIntegrationParams<T>,
  signal?: AbortSignal,
) => authApiClient.post('/integrations', params, { signal });

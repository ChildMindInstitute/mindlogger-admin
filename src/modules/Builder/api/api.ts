import { AppletId, Response } from 'shared/api/api.types';
import { authApiClient } from 'shared/api/apiConfig';

import { GetThemesParams, Theme, UploadLorisUsersVisitsParams } from './api.types';

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

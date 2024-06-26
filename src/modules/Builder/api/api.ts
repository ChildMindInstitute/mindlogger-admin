import { AppletId, Response } from 'shared/api/api.types';
import { authApiClient } from 'shared/api/apiConfig';

import { GetThemesParams, LorisActivityForm, LorisUsersVisit, Theme } from './api.types';

export const getThemesApi = (params: GetThemesParams, signal?: AbortSignal) =>
  authApiClient.get<Response<Theme>>('/themes', { params, signal });

export const setLorisIntegrationApi = ({ appletId }: AppletId, signal?: AbortSignal) =>
  authApiClient.post(
    '/integrations/loris/publish',
    {},
    { params: { applet_id: appletId }, signal },
  );

export const getLorisVisitsApi = (signal?: AbortSignal) =>
  authApiClient.get('/integrations/loris/visits', { signal });

export const getLorisUsersVisitsApi = ({ appletId }: AppletId, signal?: AbortSignal) =>
  authApiClient.get(`/integrations/loris/${appletId}/users/visits`, { signal });

export const uploadLorisUsersVisitsApi = (
  payload: LorisUsersVisit<LorisActivityForm>[],
  signal?: AbortSignal,
) => authApiClient.post('/integrations/loris/publish', payload, { signal });

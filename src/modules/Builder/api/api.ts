import { AppletId, Response } from 'shared/api/api.types';
import { authApiClient } from 'shared/api/apiConfig';

import { GetThemesParams, LorisUsersVisits, Theme } from './api.types';

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

export const getLorisUsersVisitsApi = (signal?: AbortSignal) =>
  authApiClient.get('/integrations/loris/users/visits', { signal });

export const uploadLorisUsersVisitsApi = (payload: LorisUsersVisits, signal?: AbortSignal) =>
  authApiClient.post('/integrations/loris/publish', payload, { signal });

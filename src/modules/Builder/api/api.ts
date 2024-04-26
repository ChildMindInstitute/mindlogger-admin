import { AppletId, Response } from 'shared/api/api.types';
import { authApiClient } from 'shared/api/apiConfig';

import { GetThemesParams, Theme } from './api.types';

export const getThemesApi = (params: GetThemesParams, signal?: AbortSignal) =>
  authApiClient.get<Response<Theme>>('/themes', { params, signal });

export const setLorisIntegrationApi = ({ appletId }: AppletId, signal?: AbortSignal) =>
  authApiClient.post(
    '/integrations/loris/publish',
    {},
    { params: { applet_id: appletId }, signal },
  );

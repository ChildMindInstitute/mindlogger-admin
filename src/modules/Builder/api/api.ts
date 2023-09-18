import { authApiClient } from 'shared/api/api.client';
import { Response } from 'shared/api';

import { GetThemesParams, Theme } from './api.types';

export const getThemesApi = (params: GetThemesParams, signal?: AbortSignal) =>
  authApiClient.get<Response<Theme>>('/themes', { params, signal });

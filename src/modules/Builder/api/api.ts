import { Response } from 'shared/api/api.types';
import { authApiClient } from 'shared/api/apiConfig';

import { GetThemesParams, Theme } from './api.types';

export const getThemesApi = (params: GetThemesParams, signal?: AbortSignal) =>
  authApiClient.get<Response<Theme>>('/themes', { params, signal });

import { AppletId } from 'api';
import { apiClient } from './api.client';
import { PublishedAppletsType } from './api.types';

export const getPublishedAppletsApi = (
  { page, search, limit }: PublishedAppletsType,
  signal?: AbortSignal,
) =>
  apiClient.get('/library', {
    params: {
      page,
      search,
      limit,
    },
    signal,
  });

export const getPublishedAppletApi = ({ appletId }: AppletId, signal?: AbortSignal) =>
  apiClient.get('/library', {
    params: {
      libraryId: appletId,
    },
    signal,
  });

import { AppletId } from 'api';
import { apiClient } from './api.client';
import { PublishedAppletsType } from './api.types';

export const getPublishedAppletsApi = (
  { pageIndex, search }: PublishedAppletsType,
  signal?: AbortSignal,
) =>
  apiClient.get('/library', {
    params: {
      //pageIndex, TODO: remove when pagination api vill be ready
      search,
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

import { apiClient } from './api.client';
import { PublishedAppletsType } from './api.types';

export const getPublishedAppletsApi = (
  { recordsPerPage, pageIndex, searchText = '' }: PublishedAppletsType,
  signal?: AbortSignal,
) =>
  apiClient.get('/library/applets', {
    params: {
      recordsPerPage,
      pageIndex,
      searchText,
    },
    signal,
  });

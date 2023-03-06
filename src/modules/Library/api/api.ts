import { apiClient } from './api.client';
import { PublishedApplets } from './api.types';

export const getPublishedAppletsApi = (
  { recordsPerPage, pageIndex, searchText = '' }: PublishedApplets,
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

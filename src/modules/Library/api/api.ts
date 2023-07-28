import { AppletId } from 'api';
import { apiClient, authApiClient } from 'shared/api/api.client';

import { PublishedApplet } from '../state';
import { PublishedAppletsType, AppletsFromCartType } from './api.types';
import { CART_ITEMS_WITHOUT_LIMIT } from './api.const';

export const getPublishedAppletsApi = (
  { page, search, limit }: PublishedAppletsType,
  signal?: AbortSignal,
) =>
  apiClient.get('/library', {
    params: {
      search,
      page,
      limit,
    },
    signal,
  });

export const getPublishedAppletApi = ({ appletId }: AppletId, signal?: AbortSignal) =>
  apiClient.get(`/library/${appletId}`, {
    signal,
  });

export const postAppletsToCartApi = (cartItems: PublishedApplet[], signal?: AbortSignal) =>
  authApiClient.post(
    '/library/cart',
    {
      cartItems,
    },
    { signal },
  );

export const getAppletsFromCartApi = (
  { page, search, limit }: AppletsFromCartType,
  signal?: AbortSignal,
) =>
  authApiClient.get('/library/cart', {
    params: { search, page, limit: limit ?? CART_ITEMS_WITHOUT_LIMIT },
    signal,
  });

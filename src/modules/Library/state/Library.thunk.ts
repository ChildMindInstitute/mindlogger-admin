import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { ApiErrorResponse } from 'shared/state/Base';
import { PublishedAppletsType, getPublishedAppletsApi, postAppletsToCartApi, getAppletsFromCartApi } from 'api';
import { getApiErrorResult } from 'shared/utils/errors';

import { PublishedApplet } from './Library.schema';

export const getPublishedApplets = createAsyncThunk(
  'library/getPublishedApplets',
  async (publishedApplets: PublishedAppletsType, { rejectWithValue, signal }) => {
    try {
      const { data } = await getPublishedAppletsApi(publishedApplets, signal);

      return { data };
    } catch (exception) {
      const errorResult = getApiErrorResult(exception as AxiosError<ApiErrorResponse>);

      return rejectWithValue(errorResult);
    }
  },
);

export const postAppletsToCart = createAsyncThunk(
  'library/postAppletsToCart',
  async (cartItems: PublishedApplet[], { rejectWithValue, signal }) => {
    try {
      const { data } = await postAppletsToCartApi(cartItems, signal);

      return { data };
    } catch (exception) {
      const errorResult = getApiErrorResult(exception as AxiosError<ApiErrorResponse>);

      return rejectWithValue(errorResult);
    }
  },
);

export const getAppletsFromCart = createAsyncThunk(
  'library/getAppletsFromCart',
  async (_, { rejectWithValue, signal }) => {
    try {
      const { data } = await getAppletsFromCartApi(signal);

      return { data };
    } catch (exception) {
      const errorResult = getApiErrorResult(exception as AxiosError<ApiErrorResponse>);

      return rejectWithValue(errorResult);
    }
  },
);

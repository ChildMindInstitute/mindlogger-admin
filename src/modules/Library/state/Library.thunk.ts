import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { ApiError, PublishedApplet } from 'redux/modules';
import {
  PublishedAppletsType,
  AppletsFromCartType,
  getPublishedAppletsApi,
  postAppletsToCartApi,
  getAppletsFromCartApi,
} from 'api';

export const getPublishedApplets = createAsyncThunk(
  'library/getPublishedApplets',
  async (publishedApplets: PublishedAppletsType, { rejectWithValue, signal }) => {
    try {
      return await getPublishedAppletsApi(publishedApplets, signal);
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

export const postAppletsToCart = createAsyncThunk(
  'library/postAppletsToCart',
  async (cartItems: PublishedApplet[], { rejectWithValue, signal }) => {
    try {
      return await postAppletsToCartApi(cartItems, signal);
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

export const getAppletsFromCart = createAsyncThunk(
  'library/getAppletsFromCart',
  async (cartItems: AppletsFromCartType, { rejectWithValue, signal }) => {
    try {
      return await getAppletsFromCartApi(cartItems, signal);
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { ApiError, SingleApplet } from 'redux/modules';
import {
  getAppletApi,
  AppletId,
  postAppletApi,
  putAppletApi,
  AppletBody,
  OwnerAndAppletIds,
  getAppletWithItemsApi,
} from 'api';

export const enum AppletThunkTypePrefix {
  Create = 'applet/createApplet',
  Update = 'applet/updateApplet',
}

export const getApplet = createAsyncThunk(
  'applet/getApplet',
  async ({ appletId }: AppletId, { rejectWithValue, signal }) => {
    try {
      return await getAppletApi({ appletId }, signal);
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

export const getAppletWithItems = createAsyncThunk(
  'applet/getAppletWithItems',
  async ({ ownerId, appletId }: OwnerAndAppletIds, { rejectWithValue, signal }) => {
    try {
      return await getAppletWithItemsApi({ ownerId, appletId }, signal);
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

export const createApplet = createAsyncThunk(
  AppletThunkTypePrefix.Create,
  async (body: SingleApplet, { rejectWithValue, signal }) => {
    try {
      return await postAppletApi(body, signal);
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

export const updateApplet = createAsyncThunk(
  AppletThunkTypePrefix.Update,
  async ({ appletId, body }: AppletBody, { rejectWithValue, signal }) => {
    try {
      return await putAppletApi({ appletId, body }, signal);
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

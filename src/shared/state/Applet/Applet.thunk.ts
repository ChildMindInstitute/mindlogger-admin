import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { getAppletApi, AppletId, postAppletApi, putAppletApi, AppletBody, getAppletWithItemsApi, OwnerId } from 'api';
import { ApiErrorResponse, SingleApplet } from 'redux/modules';
import { getApiErrorResult } from 'shared/utils/errors';

export const enum AppletThunkTypePrefix {
  Create = 'applet/createApplet',
  Update = 'applet/updateApplet',
}

export const getApplet = createAsyncThunk(
  'applet/getApplet',
  async ({ appletId }: AppletId, { rejectWithValue, signal }) => {
    try {
      const { data } = await getAppletApi({ appletId }, signal);

      return { data };
    } catch (exception) {
      const errorResult = getApiErrorResult(exception as AxiosError<ApiErrorResponse>);

      return rejectWithValue(errorResult);
    }
  },
);

export const getAppletWithItems = createAsyncThunk(
  'applet/getAppletWithItems',
  async ({ ownerId, appletId }: OwnerId & AppletId, { rejectWithValue, signal }) => {
    try {
      const { data } = await getAppletWithItemsApi({ ownerId, appletId }, signal);

      return { data };
    } catch (exception) {
      const errorResult = getApiErrorResult(exception as AxiosError<ApiErrorResponse>);

      return rejectWithValue(errorResult);
    }
  },
);

export const createApplet = createAsyncThunk(
  AppletThunkTypePrefix.Create,
  async ({ ownerId, body }: OwnerId & { body: SingleApplet }, { rejectWithValue, signal }) => {
    try {
      const { data } = await postAppletApi({ ownerId, body }, signal);

      return { data };
    } catch (exception) {
      const errorResult = getApiErrorResult(exception as AxiosError<ApiErrorResponse>);

      return rejectWithValue(errorResult);
    }
  },
);

export const updateApplet = createAsyncThunk(
  AppletThunkTypePrefix.Update,
  async ({ appletId, body }: AppletBody, { rejectWithValue, signal }) => {
    try {
      const { data } = await putAppletApi({ appletId, body }, signal);

      return { data };
    } catch (exception) {
      const errorResult = getApiErrorResult(exception as AxiosError<ApiErrorResponse>);

      return rejectWithValue(errorResult);
    }
  },
);

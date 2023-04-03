import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { ApiError, SingleApplet } from 'redux/modules';
import { getAppletApi, AppletId, postAppletApi, putAppletApi, AppletBody } from 'api';

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

export const createApplet = createAsyncThunk(
  'applet/createApplet',
  async (body: SingleApplet, { rejectWithValue, signal }) => {
    try {
      return await postAppletApi(body, signal);
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

export const updateApplet = createAsyncThunk(
  'applet/updateApplet',
  async ({ appletId, body }: AppletBody, { rejectWithValue, signal }) => {
    try {
      return await putAppletApi({ appletId, body }, signal);
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

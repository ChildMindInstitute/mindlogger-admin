import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { ApiError } from 'redux/modules';

import { getAppletsApi, getEventsApi, GetAppletsParams, AppletId } from 'api';

export const getApplets = createAsyncThunk(
  'applets/getApplets',
  async ({ params }: GetAppletsParams, { rejectWithValue, signal }) => {
    try {
      return await getAppletsApi({ params }, signal);
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

export const getEvents = createAsyncThunk(
  'applets/getEvents',
  async ({ appletId }: AppletId, { rejectWithValue, signal }) => {
    try {
      return await getEventsApi({ appletId }, signal);
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

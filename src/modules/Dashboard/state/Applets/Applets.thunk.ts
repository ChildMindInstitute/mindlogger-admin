import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { ApiError } from 'redux/modules';
import { getEventsApi, GetAppletsParams, AppletId, getWorkspaceAppletsApi } from 'api';

export const getWorkspaceApplets = createAsyncThunk(
  'applets/getWorkspaceApplets',
  async ({ params }: GetAppletsParams, { rejectWithValue, signal }) => {
    try {
      return await getWorkspaceAppletsApi({ params }, signal);
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

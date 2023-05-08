import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { ApiError } from 'redux/modules';
import {
  getEventsApi,
  GetAppletsParams,
  AppletId,
  getWorkspaceAppletsApi,
  RespondentId,
} from 'api';

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
  async (
    { appletId, respondentId }: AppletId & Partial<RespondentId>,
    { rejectWithValue, signal },
  ) => {
    try {
      return await getEventsApi({ appletId, respondentId }, signal);
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

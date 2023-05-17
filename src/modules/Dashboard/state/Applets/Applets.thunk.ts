import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { ApiError } from 'redux/modules';
import { getEventsApi, AppletId, RespondentId } from 'api';

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

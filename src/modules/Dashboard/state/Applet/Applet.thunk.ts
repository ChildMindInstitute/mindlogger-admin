import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { ApiError } from 'redux/modules';

import { updateRetainingSettingsApi } from 'api';

export const updateDataRetention = createAsyncThunk(
  'applet/updateDataRetention',
  async (
    { appletId, period, retention }: { appletId: string; period: string; retention: string },
    { rejectWithValue, signal },
  ) => {
    try {
      return await updateRetainingSettingsApi(
        { appletId, options: { id: appletId, period, retention } },
        signal,
      );
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

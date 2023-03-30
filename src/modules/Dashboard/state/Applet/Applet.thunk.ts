import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { ApiError } from 'redux/modules';

import { updateRetainingSettingsApi } from 'api';
import { Periods } from 'shared/features/AppletSettings/DataRetentionSetting/DataRetention.types';

export const updateDataRetention = createAsyncThunk(
  'applet/updateDataRetention',
  async (
    { appletId, period, retention }: { appletId: string; period: number; retention: Periods },
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

import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { AlertListParams, getAlertsApi, setAlertWatchedApi } from 'shared/api';
import { ApiError } from 'shared/state/Base';

export const getAlerts = createAsyncThunk(
  'alerts/getAlerts',
  async (params: AlertListParams, { rejectWithValue, signal }) => {
    try {
      return await getAlertsApi(params, signal);
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

export const setAlertWatched = createAsyncThunk(
  'alerts/setAlertWatched',
  async (alertId: string, { rejectWithValue, signal }) => {
    try {
      return await setAlertWatchedApi(alertId, signal);
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { AlertListParams, getAlertsApi, setAlertWatchedApi } from 'shared/api';
import { ApiErrorResponse } from 'shared/state/Base';
import { getApiErrorResult } from 'shared/utils/errors';

export const getAlerts = createAsyncThunk(
  'alerts/getAlerts',
  async (params: AlertListParams, { rejectWithValue, signal }) => {
    try {
      const { data } = await getAlertsApi(params, signal);

      return { data };
    } catch (exception) {
      const errorResult = getApiErrorResult(exception as AxiosError<ApiErrorResponse>);

      return rejectWithValue(errorResult);
    }
  },
);

export const setAlertWatched = createAsyncThunk(
  'alerts/setAlertWatched',
  async (alertId: string, { rejectWithValue, signal }) => {
    try {
      const { data } = await setAlertWatchedApi(alertId, signal);

      return { data };
    } catch (exception) {
      const errorResult = getApiErrorResult(exception as AxiosError<ApiErrorResponse>);

      return rejectWithValue(errorResult);
    }
  },
);

import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { ApiError } from 'redux/modules';

import { switchAccountApi, SwitchAccount, updateAlertStatusApi, UpdateAlertStatus } from 'api';

export const switchAccount = createAsyncThunk(
  'account/switchAccount',
  async ({ accountId }: SwitchAccount, { rejectWithValue, signal }) => {
    try {
      return await switchAccountApi({ accountId }, signal);
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

export const updateAlertStatus = createAsyncThunk(
  'account/updateAlertStatus',
  async ({ alertId }: UpdateAlertStatus, { rejectWithValue, signal }) => {
    try {
      return await updateAlertStatusApi({ alertId }, signal);
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

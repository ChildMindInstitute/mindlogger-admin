import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { ApiError } from 'redux/modules';

import { getAppletApi, AppletId } from 'api';

export const getApplet = createAsyncThunk(
  'applets/getApplet',
  async ({ appletId }: AppletId, { rejectWithValue, signal }) => {
    try {
      return await getAppletApi({ appletId }, signal);
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

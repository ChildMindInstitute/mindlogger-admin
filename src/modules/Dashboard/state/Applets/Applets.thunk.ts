import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { ApiError } from 'redux/modules';

import { getAppletsApi, GetAppletsParams, getWorkspaceAppletsApi } from 'api';

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

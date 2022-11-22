import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { ApiError } from 'redux/modules';

import { getAccountUserListApi } from 'api';

export const getManagersList = createAsyncThunk(
  'users/getManagersList',
  async (args, { rejectWithValue, signal }) => {
    try {
      return await getAccountUserListApi({ role: 'manager' }, signal);
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

export const getUsersList = createAsyncThunk(
  'users/getUsersList',
  async (args, { rejectWithValue, signal }) => {
    try {
      return await getAccountUserListApi({ role: 'user' }, signal);
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

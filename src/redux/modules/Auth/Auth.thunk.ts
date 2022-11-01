import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { ApiError } from 'redux/modules';

import { signIn, SignIn } from 'api';

export const login = createAsyncThunk(
  'mindlogger_login',
  async ({ email, password }: SignIn, { rejectWithValue, signal }) => {
    try {
      return await signIn({ email, password }, signal);
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

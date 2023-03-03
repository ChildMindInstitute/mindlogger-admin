import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import storage from 'utils/storage';
import { ApiError } from 'redux/modules';

import {
  signInApi,
  SignIn,
  getUserDetailsApi,
  signUpApi,
  SignUpArgs,
  resetPasswordApi,
  ResetPassword,
  SetAccount,
  setAccountNameApi,
} from 'api';

export const signIn = createAsyncThunk(
  'mindlogger_login',
  async ({ email, password }: SignIn, { rejectWithValue, signal }) => {
    try {
      const { data } = await signInApi({ email, password }, signal);

      if (data?.result) {
        const { accessToken, refreshToken } = data.result.token;
        storage.setItem('refreshToken', refreshToken);
        storage.setItem('accessToken', accessToken);
      }

      return data;
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

export const getUserDetails = createAsyncThunk(
  'mindlogger_get_user_data',
  async (_: void, { rejectWithValue, signal }) => {
    try {
      return await getUserDetailsApi(signal);
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

export const signUp = createAsyncThunk(
  'mindlogger_signup',
  async ({ body }: SignUpArgs, { rejectWithValue, signal, dispatch }) => {
    try {
      await signUpApi({ body }, signal);
      const { email, password } = body;

      return await dispatch(signIn({ email, password }));
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

export const resetPassword = createAsyncThunk(
  'mindlogger_reset_password',
  async ({ email }: ResetPassword, { rejectWithValue, signal }) => {
    try {
      return await resetPasswordApi({ email }, signal);
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

export const setAccountName = createAsyncThunk(
  'mindlogger_set_accountName',
  async ({ accountName }: SetAccount, { rejectWithValue, signal }) => {
    try {
      await setAccountNameApi({ accountName }, signal);

      return { accountName };
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

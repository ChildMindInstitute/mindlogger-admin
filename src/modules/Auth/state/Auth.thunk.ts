import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { Mixpanel, authStorage } from 'shared/utils';
import { ApiError } from 'redux/modules';
import {
  signInApi,
  SignIn,
  getUserDetailsApi,
  signUpApi,
  SignUpArgs,
  resetPasswordApi,
  ResetPassword,
} from 'api';

export const signIn = createAsyncThunk(
  'mindlogger_login',
  async ({ email, password }: SignIn, { rejectWithValue, signal }) => {
    try {
      const { data } = await signInApi({ email, password }, signal);

      if (data?.result) {
        const { accessToken, refreshToken } = data.result.token;
        authStorage.setRefreshToken(refreshToken);
        authStorage.setAccessToken(accessToken);

        Mixpanel.login(data.result.user.id);
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

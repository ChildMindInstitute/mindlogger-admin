import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { authStorage } from 'shared/utils/authStorage';
import { Mixpanel } from 'shared/utils/mixpanel';
import { getApiErrorResult, getErrorMessage } from 'shared/utils/errors';
import { ApiErrorResponse } from 'shared/state/Base';
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
  'auth/login',
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
      const errorMessage = getErrorMessage(exception as AxiosError<ApiErrorResponse>);

      return rejectWithValue(errorMessage);
    }
  },
);

export const getUserDetails = createAsyncThunk(
  'auth/getUserData',
  async (_: void, { rejectWithValue, signal }) => {
    try {
      const { data } = await getUserDetailsApi(signal);

      return { data };
    } catch (exception) {
      const errorResult = getApiErrorResult(exception as AxiosError<ApiErrorResponse>);

      return rejectWithValue(errorResult);
    }
  },
);

export const signUp = createAsyncThunk(
  'auth/signup',
  async ({ body }: SignUpArgs, { rejectWithValue, signal, dispatch }) => {
    try {
      await signUpApi({ body }, signal);
      const { email, password } = body;

      return await dispatch(signIn({ email, password }));
    } catch (exception) {
      const errorMessage = getErrorMessage(exception as AxiosError<ApiErrorResponse>);

      return rejectWithValue(errorMessage);
    }
  },
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ email }: ResetPassword, { rejectWithValue, signal }) => {
    try {
      const { data } = await resetPasswordApi({ email }, signal);

      return { data };
    } catch (exception) {
      const errorMessage = getErrorMessage(exception as AxiosError<ApiErrorResponse>);

      return rejectWithValue(errorMessage);
    }
  },
);

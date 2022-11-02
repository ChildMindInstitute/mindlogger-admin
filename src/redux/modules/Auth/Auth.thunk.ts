import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { ApiError } from 'redux/modules';

import {
  signInApi,
  SignIn,
  signInWithTokenApi,
  SignInWithToken,
  signUpApi,
  SignUpArgs,
  resetPasswordApi,
  ResetPassword,
} from 'api';

export const signIn = createAsyncThunk(
  'mindlogger_login',
  async ({ email, password }: SignIn, { rejectWithValue, signal }) => {
    try {
      const result = await signInApi({ email, password }, signal);
      if (result?.data.authToken.token) {
        sessionStorage.setItem('accessToken', result.data.authToken.token);
      }

      return result;
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

export const signInWithToken = createAsyncThunk(
  'mindlogger_login_with_token',
  async ({ token }: SignInWithToken, { rejectWithValue, signal }) => {
    try {
      return await signInWithTokenApi({ token }, signal);
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

export const signUp = createAsyncThunk(
  'mindlogger_signup',
  async ({ body }: SignUpArgs, { rejectWithValue, signal }) => {
    try {
      const result = await signUpApi({ body }, signal);
      if (result?.data.authToken.token) {
        sessionStorage.setItem('accessToken', result.data.authToken.token);
      }

      return result;
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

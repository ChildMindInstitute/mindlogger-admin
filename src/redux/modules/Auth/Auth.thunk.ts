import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { ApiError } from 'redux/modules';

import {
  signIn,
  SignIn,
  signInWithToken,
  SignInWithToken,
  signUp,
  SignUpArgs,
  resetPassword,
  ResetPassword,
} from 'api';

export const login = createAsyncThunk(
  'mindlogger_login',
  async ({ email, password }: SignIn, { rejectWithValue, signal }) => {
    try {
      const result = await signIn({ email, password }, signal);
      if (result && result.data.authToken.token) {
        sessionStorage.setItem('accessToken', result.data.authToken.token);
      }

      return result;
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

export const loginWithToken = createAsyncThunk(
  'mindlogger_login_with_token',
  async ({ token }: SignInWithToken, { rejectWithValue, signal }) => {
    try {
      return await signInWithToken({ token }, signal);
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

export const signup = createAsyncThunk(
  'mindlogger_signup',
  async ({ body }: SignUpArgs, { rejectWithValue, signal }) => {
    try {
      const result = await signUp({ body }, signal);
      if (result && result.data.authToken.token) {
        sessionStorage.setItem('accessToken', result.data.authToken.token);
      }

      return result;
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

export const resetPwd = createAsyncThunk(
  'mindlogger_reset_password',
  async ({ email }: ResetPassword, { rejectWithValue, signal }) => {
    try {
      return await resetPassword({ email }, signal);
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

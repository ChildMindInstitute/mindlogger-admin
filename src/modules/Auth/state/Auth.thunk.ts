import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { datadogRum } from '@datadog/browser-rum';

import { RootState } from 'redux/store';
import { authStorage } from 'shared/utils/authStorage';
import { Mixpanel } from 'shared/utils/mixpanel';
import { getApiErrorResult, getErrorMessage } from 'shared/utils/errors';
import { ApiErrorResponse } from 'shared/state/Base';
import { FeatureFlags } from 'shared/utils/featureFlags';
import {
  getUserDetailsApi,
  ResetPassword,
  resetPasswordApi,
  SignIn,
  signInApi,
  signUpApi,
  SignUpArgs,
  verifyMFATOTPApi,
  verifyMFARecoveryCodeApi,
} from 'api';

export const signIn = createAsyncThunk(
  'auth/login',
  async ({ email, password }: SignIn, { rejectWithValue, signal }) => {
    try {
      const { data } = await signInApi({ email, password }, signal);

      if (data?.result) {
        // Check if MFA is required
        if ('mfaRequired' in data.result && data.result.mfaRequired) {
          // Return the MFA session data without setting tokens
          return data;
        }

        // Standard login flow (MFA not required)
        const { accessToken, refreshToken } = data.result.token;
        authStorage.setRefreshToken(refreshToken);
        authStorage.setAccessToken(accessToken);

        datadogRum.setUser({ id: data.result.user.id });
        Mixpanel.login(data.result.user.id);
        FeatureFlags.login(data.result.user.id);
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
      if (data?.result) {
        // Make sure to identify session with LD, e.g. when user is already logged in
        FeatureFlags.login(data.result.id);
      }

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

// MFA verification thunks
export const verifyMFATOTP = createAsyncThunk(
  'auth/verifyMFATOTP',
  async ({ totpCode }: { totpCode: string }, { getState, rejectWithValue, signal }) => {
    try {
      const state = getState() as RootState;
      const { mfaSession } = state.auth;

      if (!mfaSession) {
        throw new Error('MFA session not found');
      }

      // Check if session has expired
      if (Date.now() > mfaSession.expiresAt) {
        return rejectWithValue({ message: 'MFA session expired' });
      }

      const { data } = await verifyMFATOTPApi(
        {
          mfaToken: mfaSession.token,
          totpCode,
        },
        signal,
      );

      if (data?.result) {
        const { accessToken, refreshToken } = data.result.token;
        authStorage.setRefreshToken(refreshToken);
        authStorage.setAccessToken(accessToken);

        datadogRum.setUser({ id: data.result.user.id });
        Mixpanel.login(data.result.user.id);
        FeatureFlags.login(data.result.user.id);
      }

      return data;
    } catch (exception) {
      const errorMessage = getErrorMessage(exception as AxiosError<ApiErrorResponse>);

      return rejectWithValue(errorMessage);
    }
  },
);

export const verifyMFARecoveryCode = createAsyncThunk(
  'auth/verifyMFARecoveryCode',
  async ({ code }: { code: string }, { getState, rejectWithValue, signal }) => {
    try {
      const state = getState() as RootState;
      const { mfaSession } = state.auth;

      if (!mfaSession) {
        throw new Error('MFA session not found');
      }

      // Check if session has expired
      if (Date.now() > mfaSession.expiresAt) {
        return rejectWithValue({ message: 'MFA session expired' });
      }

      const { data } = await verifyMFARecoveryCodeApi(
        {
          mfaToken: mfaSession.token,
          code,
        },
        signal,
      );

      if (data?.result) {
        const { accessToken, refreshToken } = data.result.token;
        authStorage.setRefreshToken(refreshToken);
        authStorage.setAccessToken(accessToken);

        datadogRum.setUser({ id: data.result.user.id });
        Mixpanel.login(data.result.user.id);
        FeatureFlags.login(data.result.user.id);
      }

      return data;
    } catch (exception) {
      const errorMessage = getErrorMessage(exception as AxiosError<ApiErrorResponse>);

      return rejectWithValue(errorMessage);
    }
  },
);

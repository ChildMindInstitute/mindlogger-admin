import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { datadogRum } from '@datadog/browser-rum';

import { RootState } from 'redux/store';
import { authStorage } from 'shared/utils/authStorage';
import { Mixpanel } from 'shared/utils/mixpanel';
import { getApiErrorResult, getErrorMessage } from 'shared/utils/errors';
import { ApiErrorResponse } from 'shared/state/Base';
import { FeatureFlags } from 'shared/utils/featureFlags';
import { setLastActivityAt } from 'shared/hooks/useSessionKeepAlive/sessionStore';
import {
  acceptMSAAtLoginApi,
  getUserDetailsApi,
  ResetPassword,
  resetPasswordApi,
  SignIn,
  signInApi,
  signUpApi,
  SignUpArgs,
  verifyMFATOTPApi,
  verifyMFARecoveryCodeApi,
  MFAVerifyResponse,
  MFAVerifySuccessResponse,
  MSAAcceptAtLoginError,
  MSARequiredResponse,
  StandardLoginResponse,
} from 'api';

import { getMfaErrorResult } from '../utils/mfa.utils';

type MFAErrorLike = {
  message?: string;
  result?: {
    message?: string;
  };
};

const extractMFAErrorMessage = (response: unknown, defaultMessage: string): string => {
  if (response && typeof response === 'object') {
    const { message, result } = response as MFAErrorLike;
    if (typeof message === 'string') return message;
    if (result?.message && typeof result.message === 'string') return result.message;
  }

  return defaultMessage;
};

// Shared type guard for MFA verification responses
const hasValidMFAVerifyResponse = (
  response: MFAVerifyResponse | undefined,
): response is MFAVerifySuccessResponse => {
  if (!response?.result) return false;

  const result = response.result;

  // Check if result has the structure of a success response
  if ('token' in result && 'user' in result) {
    return Boolean(
      result.token?.accessToken &&
      result.token?.refreshToken &&
      result.user?.id &&
      typeof result.token.accessToken === 'string' &&
      typeof result.token.refreshToken === 'string',
    );
  }

  return false;
};

// Admin login held back until the MSA is accepted
const isMSARequiredResponse = (
  response: MFAVerifyResponse | undefined,
): response is MSARequiredResponse =>
  Boolean(response?.result && 'msaRequired' in response.result && response.result.msaRequired);

// Saves the tokens of a completed login and identifies the user to tracking
const storeLoginSession = ({ token, user }: StandardLoginResponse['result']) => {
  authStorage.setRefreshToken(token.refreshToken);
  authStorage.setAccessToken(token.accessToken);
  // A new session starts its own clock. One left by a session whose tab never logged out
  // would put this one past its deadline, and the tracker only writes when there is none.
  setLastActivityAt(Date.now());

  datadogRum.setUser({ id: user.id });
  Mixpanel.login(user.id);
  FeatureFlags.login(user.id);
};

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

        // MSA must be accepted before tokens are issued
        if ('msaRequired' in data.result && data.result.msaRequired) {
          return data;
        }

        // Standard login flow (MFA not required)
        storeLoginSession(data.result);
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

      // Session expiry is validated by the backend
      const response = await verifyMFATOTPApi(
        {
          mfaToken: mfaSession.token,
          totpCode,
        },
        signal,
      );
      const { data } = response || {};

      // MSA must be accepted before tokens are issued
      if (isMSARequiredResponse(data)) return data;

      if (!hasValidMFAVerifyResponse(data)) {
        const message = extractMFAErrorMessage(data, 'Invalid verification code');

        return rejectWithValue(message);
      }

      if (data?.result) {
        storeLoginSession(data.result);
      }

      return data;
    } catch (exception) {
      return rejectWithValue(getMfaErrorResult(exception, 'totp'));
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

      // Session expiry is validated by the backend
      const response = await verifyMFARecoveryCodeApi(
        {
          mfaToken: mfaSession.token,
          code,
        },
        signal,
      );
      const { data } = response || {};

      // MSA must be accepted before tokens are issued
      if (isMSARequiredResponse(data)) return data;

      if (!hasValidMFAVerifyResponse(data)) {
        const message = extractMFAErrorMessage(data, 'Invalid recovery code');

        return rejectWithValue(message);
      }

      if (data?.result) {
        storeLoginSession(data.result);
      }

      return data;
    } catch (exception) {
      return rejectWithValue(getMfaErrorResult(exception, 'recovery'));
    }
  },
);

// Accepts the MSA during login and completes it with the tokens returned
export const acceptMSAAtLogin = createAsyncThunk(
  'auth/acceptMSAAtLogin',
  async (_: void, { getState, rejectWithValue, signal }) => {
    try {
      const { msaSession } = (getState() as RootState).auth;

      if (!msaSession) {
        throw new Error('MSA session not found');
      }

      const { data } = await acceptMSAAtLoginApi(
        { msaToken: msaSession.token, msaVersion: msaSession.version },
        signal,
      );
      storeLoginSession(data.result);

      return data;
    } catch (exception) {
      const error = exception as AxiosError<ApiErrorResponse & { error_code?: string }>;
      const result: MSAAcceptAtLoginError = {
        message: getErrorMessage(error),
        errorCode: error.response?.data?.error_code,
      };

      return rejectWithValue(result);
    }
  },
);

import {
  apiClient,
  authApiClientWithoutRefresh,
  authApiClientRemoveRefresh,
} from 'shared/api/apiConfig';

import {
  ApproveRecoveryPassword,
  RecoverPasswordHealthCheck,
  ResetPassword,
  SignIn,
  SignUpArgs,
  MFATOTPVerifyRequest,
  MFARecoveryCodeVerifyRequest,
  MFAVerifyResponse,
} from './api.types';

export const signInApi = ({ email, password }: SignIn, signal?: AbortSignal) =>
  apiClient.post(
    'auth/login',
    { email, password },
    {
      signal,
    },
  );

export const deleteAccessTokenApi = () => authApiClientWithoutRefresh.post('auth/logout');

export const deleteRefreshTokenApi = () => authApiClientRemoveRefresh.post('auth/logout2');

export const signUpApi = ({ body }: SignUpArgs, signal?: AbortSignal) =>
  apiClient.post(
    '/users',
    { ...body },
    {
      signal,
    },
  );

export const resetPasswordApi = ({ email }: ResetPassword, signal?: AbortSignal) =>
  apiClient.post(
    '/users/me/password/recover',
    { email },
    {
      signal,
    },
  );

export const recoveryLinkHealthCheckApi = ({ email, key }: RecoverPasswordHealthCheck) =>
  apiClient.get('/users/me/password/recover/healthcheck', {
    params: { email, key },
  });

export const approveRecoveryPasswordApi = (
  { email, key, password }: ApproveRecoveryPassword,
  signal?: AbortSignal,
) =>
  apiClient.post(
    '/users/me/password/recover/approve',
    { email, key, password },
    {
      signal,
    },
  );

// MFA API functions
export const verifyMFATOTPApi = (data: MFATOTPVerifyRequest, signal?: AbortSignal) =>
  apiClient.post<MFAVerifyResponse>('/auth/mfa/totp/verify', data, { signal });

export const verifyMFARecoveryCodeApi = (
  data: MFARecoveryCodeVerifyRequest,
  signal?: AbortSignal,
) => apiClient.post<MFAVerifyResponse>('/auth/mfa/recovery-codes/verify', data, { signal });

import { vi } from 'vitest';

import { acceptMSAAtLoginApi, signInApi, verifyMFATOTPApi, verifyMFARecoveryCodeApi } from 'api';
import { setupStore } from 'redux/store';
import {
  clearSessionState,
  getLastActivityAt,
  setLastActivityAt,
} from 'shared/hooks/useSessionKeepAlive/sessionStore';
import { MS_IN_MIN } from 'shared/hooks/useSessionKeepAlive/useSessionKeepAlive.const';
import { authStorage } from 'shared/utils/authStorage';

import { acceptMSAAtLogin, signIn, verifyMFATOTP, verifyMFARecoveryCode } from './Auth.thunk';

vi.mock('api', async () => {
  const actual = await vi.importActual<typeof import('api')>('api');

  return {
    ...actual,
    acceptMSAAtLoginApi: vi.fn(),
    signInApi: vi.fn(),
    verifyMFATOTPApi: vi.fn(),
    verifyMFARecoveryCodeApi: vi.fn(),
  };
});

const mockAcceptMSAAtLoginApi = vi.mocked(acceptMSAAtLoginApi);
const mockSignInApi = vi.mocked(signInApi);
const mockVerifyMFATOTPApi = vi.mocked(verifyMFATOTPApi);
const mockVerifyMFARecoveryCodeApi = vi.mocked(verifyMFARecoveryCodeApi);

// MFA session only contains backend-provided tokens
// Session expiry and attempts are tracked by the backend
const baseAuthState = {
  mfaSession: {
    token: 'mfa-token',
    sessionId: 'session-id',
  },
  totpVerification: {
    status: 'idle' as const,
  },
  recoveryVerification: {
    status: 'idle' as const,
  },
  isSessionExpired: false,
  authentication: {
    status: 'idle' as const,
    requestId: 'req-1',
    data: null,
  },
  isAuthorized: false,
  isLogoutInProgress: false,
};

const getPreloadedState = () => ({
  auth: {
    ...baseAuthState,
    mfaSession: { ...baseAuthState.mfaSession },
    totpVerification: { ...baseAuthState.totpVerification },
    recoveryVerification: { ...baseAuthState.recoveryVerification },
    authentication: { ...baseAuthState.authentication },
  },
});

describe('Auth MFA thunks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects TOTP verification responses that do not include tokens', async () => {
    mockVerifyMFATOTPApi.mockResolvedValueOnce({ data: { message: 'Invalid TOTP code' } } as any);

    const store = setupStore(getPreloadedState());

    const result = await store.dispatch(verifyMFATOTP({ totpCode: '123456' }));

    expect(verifyMFATOTP.rejected.match(result)).toBe(true);

    const state = store.getState().auth;
    // TOTP verification error is stored in totpVerification state
    expect(state.totpVerification.status).toBe('error');
    expect(state.totpVerification.displayError).toBeDefined();
    // Note: attempts tracking is handled server-side, client uses attemptsRemaining from API response
    expect(state.mfaSession).toBeDefined();
  });

  // A backgrounded tab can miss its idle logout, leaving its clock behind. Read by the new
  // session, it ended the sign-in as soon as it landed.
  it('keeps the MSA session and stores no tokens when TOTP verify requires the MSA', async () => {
    authStorage.clear();
    mockVerifyMFATOTPApi.mockResolvedValueOnce({
      data: {
        result: {
          msaRequired: true,
          msaToken: 'msa-token',
          version: '2026-11-01',
          userId: 'user-id',
          userEmail: 'admin@example.com',
          deadline: '2026-12-31',
        },
      },
    } as any);

    const store = setupStore(getPreloadedState());
    const result = await store.dispatch(verifyMFATOTP({ totpCode: '123456' }));

    expect(verifyMFATOTP.fulfilled.match(result)).toBe(true);
    const state = store.getState().auth;
    expect(state.msaSession?.deadline).toBe('2026-12-31');
    expect(state.isAuthorized).toBe(false);
    expect(authStorage.getAccessToken()).toBeFalsy();
  });

  it('starts a fresh clock over one left by a session that never logged out', async () => {
    clearSessionState();
    setLastActivityAt(Date.now() - 60 * MS_IN_MIN);
    mockVerifyMFATOTPApi.mockResolvedValueOnce({
      data: {
        result: {
          user: { id: 'user-1' },
          token: { accessToken: 'access', refreshToken: 'refresh' },
        },
      },
    } as never);

    const store = setupStore(getPreloadedState());
    await store.dispatch(verifyMFATOTP({ totpCode: '123456' }));

    expect(Date.now() - (getLastActivityAt() ?? 0)).toBeLessThan(MS_IN_MIN);

    clearSessionState();
  });

  it('rejects recovery code responses that do not include tokens', async () => {
    mockVerifyMFARecoveryCodeApi.mockResolvedValueOnce({
      data: { message: 'Invalid recovery code' },
    } as any);

    const store = setupStore(getPreloadedState());

    const result = await store.dispatch(verifyMFARecoveryCode({ code: 'ABCDE-12345' }));

    expect(verifyMFARecoveryCode.rejected.match(result)).toBe(true);

    const state = store.getState().auth;
    // Recovery verification error is stored in recoveryVerification state
    expect(state.recoveryVerification.status).toBe('error');
    expect(state.recoveryVerification.displayError).toBeDefined();
    expect(state.mfaSession).toBeDefined();
  });
});

describe('Auth signIn thunk', () => {
  it('keeps the MSA session and stores no tokens when the MSA must be accepted', async () => {
    authStorage.clear();
    mockSignInApi.mockResolvedValueOnce({
      data: {
        result: {
          msaRequired: true,
          msaToken: 'msa-token',
          version: '2026-11-01',
          userId: 'user-id',
          userEmail: 'admin@example.com',
          deadline: null,
        },
      },
    } as any);

    const store = setupStore();
    await store.dispatch(signIn({ email: 'admin@example.com', password: 'password' }));

    const state = store.getState().auth;
    expect(state.msaSession).toEqual({
      token: 'msa-token',
      version: '2026-11-01',
      email: 'admin@example.com',
      deadline: null,
    });
    expect(state.isAuthorized).toBe(false);
    expect(authStorage.getAccessToken()).toBeFalsy();
  });
});

describe('Auth acceptMSAAtLogin thunk', () => {
  it('accepts with the MSA session and completes the login', async () => {
    authStorage.clear();
    mockAcceptMSAAtLoginApi.mockResolvedValueOnce({
      data: {
        result: {
          token: { accessToken: 'access', refreshToken: 'refresh' },
          user: { id: 'user-id', email: 'admin@example.com', firstName: 'A', lastName: 'B' },
        },
      },
    } as any);

    const store = setupStore({
      auth: {
        ...getPreloadedState().auth,
        msaSession: {
          token: 'msa-token',
          version: '2026-11-01',
          email: 'admin@example.com',
          deadline: null,
        },
      },
    });
    const result = await store.dispatch(acceptMSAAtLogin());

    expect(acceptMSAAtLogin.fulfilled.match(result)).toBe(true);
    expect(mockAcceptMSAAtLoginApi).toHaveBeenCalledWith(
      { msaToken: 'msa-token', msaVersion: '2026-11-01' },
      expect.anything(),
    );
    expect(authStorage.getAccessToken()).toBe('access');
    expect(store.getState().auth.isAuthorized).toBe(true);
  });
});

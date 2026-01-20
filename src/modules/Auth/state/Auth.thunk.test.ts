import { vi } from 'vitest';

import { verifyMFATOTPApi, verifyMFARecoveryCodeApi } from 'api';
import { setupStore } from 'redux/store';

import { verifyMFATOTP, verifyMFARecoveryCode } from './Auth.thunk';

vi.mock('api', async () => {
  const actual = await vi.importActual<typeof import('api')>('api');

  return {
    ...actual,
    verifyMFATOTPApi: vi.fn(),
    verifyMFARecoveryCodeApi: vi.fn(),
  };
});

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

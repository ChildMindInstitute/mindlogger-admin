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

const baseAuthState = {
  mfaSession: {
    token: 'mfa-token',
    sessionId: 'session-id',
    attempts: 0,
    expiresAt: Date.now() + 5 * 60 * 1000,
  },
  mfaVerification: {
    status: 'idle' as const,
    error: undefined,
  },
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
    mfaVerification: { ...baseAuthState.mfaVerification },
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
    expect(result.payload).toBe('Invalid TOTP code');

    const state = store.getState().auth;
    expect(state.mfaVerification.error).toBe('Invalid TOTP code');
    expect(state.mfaSession?.attempts).toBe(1);
  });

  it('rejects recovery code responses that do not include tokens', async () => {
    mockVerifyMFARecoveryCodeApi.mockResolvedValueOnce({
      data: { message: 'Invalid recovery code' },
    } as any);

    const store = setupStore(getPreloadedState());

    const result = await store.dispatch(verifyMFARecoveryCode({ code: 'ABCDE-12345' }));

    expect(verifyMFARecoveryCode.rejected.match(result)).toBe(true);
    expect(result.payload).toBe('Invalid recovery code');

    const state = store.getState().auth;
    expect(state.mfaVerification.error).toBe('Invalid recovery code');
    expect(state.mfaSession).toBeDefined();
  });
});

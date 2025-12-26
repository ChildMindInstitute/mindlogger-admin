import { renderHook, act, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { vi } from 'vitest';
import type { AxiosResponse, AxiosHeaders } from 'axios';

import { verifyMFATOTPApi } from 'api';
import { auth } from 'modules/Auth/state';
import { navigateToLibrary } from 'modules/Auth/utils';
import { setupStore } from 'redux/store';
import type { MFAVerifyResponse } from 'modules/Auth/api/api.types';

import { useMFAVerification } from './useMFAVerification';

// Mock dependencies
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useNavigate: () => mockNavigate,
}));

vi.mock('modules/Auth/utils', () => ({
  navigateToLibrary: vi.fn(),
}));

// Mock the API calls
vi.mock('api', () => ({
  verifyMFATOTPApi: vi.fn(),
  verifyMFARecoveryCodeApi: vi.fn(),
}));

const mockVerifyAPI = vi.mocked(verifyMFATOTPApi);

// Mock react-i18next
vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next');

  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => {
        const translations: Record<string, string> = {
          invalidCode: 'Invalid code',
          invalidRecoveryCode: 'Invalid recovery code',
          mfaSessionExpired: 'Your session has expired. Please log in again.',
          somethingWentWrong: 'Something went wrong',
        };

        return translations[key] || key;
      },
    }),
  };
});

describe('useMFAVerification', () => {
  let store: ReturnType<typeof setupStore>;

  beforeEach(() => {
    vi.clearAllMocks();
    store = setupStore({
      auth: {
        mfaSession: {
          token: 'test-token',
          sessionId: 'test-session',
          attempts: 0,
          expiresAt: Date.now() + 5 * 60 * 1000,
        },
        mfaVerification: {
          status: 'idle',
          error: undefined,
          isSessionExpired: false,
        },
        authentication: {
          status: 'idle',
          requestId: 'test',
          data: null,
        },
        isAuthorized: false,
        isLogoutInProgress: false,
      },
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

  it('should initialize with correct state', () => {
    const { result } = renderHook(() => useMFAVerification('totp'), { wrapper });

    expect(result.current.error).toBeUndefined();
    expect(result.current.displayError).toBeUndefined();
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.attempts).toBe(0);
    expect(result.current.maxAttempts).toBe(5);
  });

  it('should verify TOTP code successfully', async () => {
    const mockDispatch = vi.spyOn(store, 'dispatch');
    mockDispatch.mockResolvedValueOnce({
      type: 'auth/verifyMFATOTP/fulfilled',
      payload: { result: { user: { id: 'user-123' } } },
    });

    const { result } = renderHook(() => useMFAVerification('totp'), { wrapper });

    let verifyResult;
    await act(async () => {
      verifyResult = await result.current.verifyCode('123456');
    });

    expect(verifyResult).toBe(true);
    expect(navigateToLibrary).toHaveBeenCalledWith(mockNavigate);
  });

  it('should handle TOTP verification failure', async () => {
    // Mock API to return error response
    const mockResponse = {
      data: {
        result: {
          message: 'Invalid TOTP code',
        },
      },
      status: 400,
      statusText: 'Bad Request',
      headers: {} as AxiosHeaders,
      config: {
        headers: {} as AxiosHeaders,
      } as any,
    } satisfies AxiosResponse<MFAVerifyResponse>;

    mockVerifyAPI.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useMFAVerification('totp'), { wrapper });

    let verifyResult;
    await act(async () => {
      verifyResult = await result.current.verifyCode('123456');
    });

    expect(verifyResult).toBe(false);
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.displayError).toBe('invalidCode');
  });

  it('should verify recovery code successfully', async () => {
    const mockDispatch = vi.spyOn(store, 'dispatch');
    mockDispatch.mockResolvedValueOnce({
      type: 'auth/verifyMFARecoveryCode/fulfilled',
      payload: { result: { user: { id: 'user-123' } } },
    });

    const { result } = renderHook(() => useMFAVerification('recovery'), { wrapper });

    let verifyResult;
    await act(async () => {
      verifyResult = await result.current.verifyCode('ABCDE-12345');
    });

    expect(verifyResult).toBe(true);
    expect(navigateToLibrary).toHaveBeenCalledWith(mockNavigate);
  });

  it('should clear error when clearError is called', () => {
    const mockDispatch = vi.spyOn(store, 'dispatch');

    // Set an error in the store
    act(() => {
      store.dispatch(auth.actions.setMFAError('Test error'));
    });

    const { result } = renderHook(() => useMFAVerification('totp'), { wrapper });

    expect(result.current.error).toBe('Test error');
    // Note: setMFAError only sets 'error', not 'displayError' - displayError is set by thunk rejections

    act(() => {
      result.current.clearError();
    });

    expect(mockDispatch).toHaveBeenCalledWith(auth.actions.clearMFAError());
  });

  it('should not allow concurrent submissions', async () => {
    const mockDispatch = vi.spyOn(store, 'dispatch');
    mockDispatch.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ type: 'fulfilled' }), 100)),
    );

    const { result } = renderHook(() => useMFAVerification('totp'), { wrapper });

    // Start first verification
    act(() => {
      result.current.verifyCode('123456');
    });

    expect(result.current.isSubmitting).toBe(true);

    // Try to submit again while first is in progress
    let secondResult;
    await act(async () => {
      secondResult = await result.current.verifyCode('654321');
    });

    // Second call should return false immediately without dispatching
    expect(secondResult).toBe(false);
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });

  it('should handle session expiry', async () => {
    const expiredStore = setupStore({
      auth: {
        mfaSession: {
          token: 'test-token',
          sessionId: 'test-session',
          attempts: 0,
          expiresAt: Date.now() - 1000, // Already expired
        },
        mfaVerification: {
          status: 'idle',
          error: undefined,
          isSessionExpired: false,
        },
        authentication: {
          status: 'idle',
          requestId: 'test',
          data: null,
        },
        isAuthorized: false,
        isLogoutInProgress: false,
      },
    });

    const expiredWrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={expiredStore}>{children}</Provider>
    );

    renderHook(() => useMFAVerification('totp'), { wrapper: expiredWrapper });

    await waitFor(() => {
      const state = expiredStore.getState();
      // Session expiry now uses displayError key and isSessionExpired flag
      expect(state.auth.mfaVerification.displayError).toBe('mfaSessionExpired');
      expect(state.auth.mfaVerification.isSessionExpired).toBe(true);
    });
  });
});

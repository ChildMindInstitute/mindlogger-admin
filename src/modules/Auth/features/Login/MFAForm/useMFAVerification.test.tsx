import { renderHook, act, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';

import { auth } from 'modules/Auth/state';
import { navigateToLibrary } from 'modules/Auth/utils';
import { setupStore } from 'redux/store';

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
    const mockDispatch = vi.spyOn(store, 'dispatch');
    mockDispatch.mockResolvedValueOnce({
      type: 'auth/verifyMFATOTP/rejected',
      payload: 'Invalid TOTP code',
    });

    const { result } = renderHook(() => useMFAVerification('totp'), { wrapper });

    let verifyResult;
    await act(async () => {
      verifyResult = await result.current.verifyCode('123456');
    });

    expect(verifyResult).toBe(false);
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.displayError).toBe('Invalid code');
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
    expect(result.current.displayError).toBeDefined();

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

    // Second call should return immediately without dispatching
    expect(secondResult).toBeUndefined();
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
      expect(state.auth.mfaVerification.error).toBe(
        'Your session has expired. Please log in again.',
      );
    });
  });
});

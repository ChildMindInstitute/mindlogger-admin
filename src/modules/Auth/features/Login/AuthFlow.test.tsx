import React from 'react';
import { screen, render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';

import { auth } from 'modules/Auth/state';
import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { setupStore } from 'redux/store';

import { AuthFlow } from './AuthFlow';

// Mock child components
vi.mock('./LoginForm', () => ({
  LoginForm: () => <div data-testid="login-form">Login Form</div>,
}));

vi.mock('./MFAForm', () => ({
  MFAForm: ({ onSwitchToRecovery }: any) => (
    <div data-testid="mfa-form">
      MFA Form
      <button onClick={onSwitchToRecovery}>Switch to Recovery</button>
    </div>
  ),
  RecoveryCodeForm: ({ onSwitchToTOTP }: any) => (
    <div data-testid="recovery-form">
      Recovery Form
      <button onClick={onSwitchToTOTP}>Switch to TOTP</button>
    </div>
  ),
}));

describe('AuthFlow', () => {
  const defaultMfaSession = {
    token: 'mfa-token-123',
    sessionId: 'session-123',
    attempts: 0,
    expiresAt: Date.now() + 5 * 60 * 1000,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderAuthFlow = (preloadedState = {}) => {
    const defaultState = {
      auth: {
        mfaSession: undefined,
        authentication: {
          status: 'idle' as const,
          requestId: 'test-request-id',
          data: null,
        },
        isAuthorized: false,
        isLogoutInProgress: false,
      },
    };

    const state = {
      ...defaultState,
      ...preloadedState,
    };

    return renderWithProviders(<AuthFlow />, { preloadedState: state });
  };

  it('shows LoginForm by default when no MFA session', () => {
    renderAuthFlow({
      auth: {
        mfaSession: undefined,
        authentication: {
          status: 'idle' as const,
          requestId: 'test-request-id',
          data: null,
        },
        isAuthorized: false,
        isLogoutInProgress: false,
      },
    });

    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.queryByTestId('mfa-form')).not.toBeInTheDocument();
    expect(screen.queryByTestId('recovery-form')).not.toBeInTheDocument();
  });

  it('shows MFAForm when mfaSession exists', () => {
    renderAuthFlow({
      auth: {
        mfaSession: defaultMfaSession,
        authentication: {
          status: 'idle' as const,
          requestId: 'test-request-id',
          data: null,
        },
        isAuthorized: false,
        isLogoutInProgress: false,
      },
    });

    expect(screen.getByTestId('mfa-form')).toBeInTheDocument();
    expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();
    expect(screen.queryByTestId('recovery-form')).not.toBeInTheDocument();
  });

  it('switches to RecoveryCodeForm when requested', () => {
    renderAuthFlow({
      auth: {
        mfaSession: defaultMfaSession,
        authentication: {
          status: 'idle' as const,
          requestId: 'test-request-id',
          data: null,
        },
        isAuthorized: false,
        isLogoutInProgress: false,
      },
    });

    // Initially shows MFA form
    expect(screen.getByTestId('mfa-form')).toBeInTheDocument();

    // Click switch to recovery
    const switchButton = screen.getByText('Switch to Recovery');
    fireEvent.click(switchButton);

    // Should show recovery form
    expect(screen.getByTestId('recovery-form')).toBeInTheDocument();
    expect(screen.queryByTestId('mfa-form')).not.toBeInTheDocument();
  });

  it('switches back to MFAForm from RecoveryCodeForm', () => {
    renderAuthFlow({
      auth: {
        mfaSession: defaultMfaSession,
        authentication: {
          status: 'idle' as const,
          requestId: 'test-request-id',
          data: null,
        },
        isAuthorized: false,
        isLogoutInProgress: false,
      },
    });

    // Switch to recovery form first
    const switchToRecoveryButton = screen.getByText('Switch to Recovery');
    fireEvent.click(switchToRecoveryButton);

    expect(screen.getByTestId('recovery-form')).toBeInTheDocument();

    // Now switch back to TOTP
    const switchToTOTPButton = screen.getByText('Switch to TOTP');
    fireEvent.click(switchToTOTPButton);

    // Should show MFA form again
    expect(screen.getByTestId('mfa-form')).toBeInTheDocument();
    expect(screen.queryByTestId('recovery-form')).not.toBeInTheDocument();
  });

  it('clears MFA session on unmount', () => {
    const store = setupStore({
      auth: {
        mfaSession: defaultMfaSession,
        authentication: {
          status: 'idle' as const,
          requestId: 'test-request-id',
          data: null,
        },
        isAuthorized: false,
        isLogoutInProgress: false,
      },
    });

    const dispatchSpy = vi.spyOn(store, 'dispatch');

    const { unmount } = render(
      <Provider store={store}>
        <AuthFlow />
      </Provider>,
    );

    // Unmount the component
    unmount();

    // Should dispatch clearMFASession
    expect(dispatchSpy).toHaveBeenCalledWith(auth.actions.clearMFASession());
  });

  it('does not clear MFA session on unmount if session is null', () => {
    const store = setupStore({
      auth: {
        mfaSession: undefined,
        authentication: {
          status: 'idle' as const,
          requestId: 'test-request-id',
          data: null,
        },
        isAuthorized: false,
        isLogoutInProgress: false,
      },
    });

    const dispatchSpy = vi.spyOn(store, 'dispatch');

    const { unmount } = render(
      <Provider store={store}>
        <AuthFlow />
      </Provider>,
    );

    // Clear previous calls
    dispatchSpy.mockClear();

    // Unmount the component
    unmount();

    // Should not dispatch clearMFASession
    expect(dispatchSpy).not.toHaveBeenCalledWith(auth.actions.clearMFASession());
  });

  it('transitions from login to MFA when session is created', () => {
    const store = setupStore({
      auth: {
        mfaSession: undefined,
        authentication: {
          status: 'idle' as const,
          requestId: 'test-request-id',
          data: null,
        },
        isAuthorized: false,
        isLogoutInProgress: false,
      },
    });

    const { rerender } = render(
      <Provider store={store}>
        <AuthFlow />
      </Provider>,
    );

    expect(screen.getByTestId('login-form')).toBeInTheDocument();

    // Update store state to have MFA session
    store.dispatch(auth.actions.setMFASession(defaultMfaSession));

    // Re-render to see the state change
    rerender(
      <Provider store={store}>
        <AuthFlow />
      </Provider>,
    );

    // Should now show MFA form
    expect(screen.getByTestId('mfa-form')).toBeInTheDocument();
    expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();
  });

  it('transitions from MFA to login when session is cleared', () => {
    const store = setupStore({
      auth: {
        mfaSession: defaultMfaSession,
        authentication: {
          status: 'idle' as const,
          requestId: 'test-request-id',
          data: null,
        },
        isAuthorized: false,
        isLogoutInProgress: false,
      },
    });

    const { rerender } = render(
      <Provider store={store}>
        <AuthFlow />
      </Provider>,
    );

    expect(screen.getByTestId('mfa-form')).toBeInTheDocument();

    // Clear MFA session
    store.dispatch(auth.actions.clearMFASession());

    // Re-render to see the state change
    rerender(
      <Provider store={store}>
        <AuthFlow />
      </Provider>,
    );

    // Should now show login form
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.queryByTestId('mfa-form')).not.toBeInTheDocument();
  });
});

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
  MFAForm: ({ onSwitchToRecovery }: { onSwitchToRecovery?: () => void }) => (
    <div data-testid="mfa-form">
      MFA Form
      <button onClick={onSwitchToRecovery}>Switch to Recovery</button>
    </div>
  ),
  RecoveryCodeForm: ({ onSwitchToTOTP }: { onSwitchToTOTP?: () => void }) => (
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
        mfaVerification: {
          status: 'idle' as const,
          error: undefined,
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
        mfaVerification: {
          status: 'idle' as const,
          error: undefined,
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
        mfaVerification: {
          status: 'idle' as const,
          error: undefined,
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
        mfaVerification: {
          status: 'idle' as const,
          error: undefined,
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
        mfaVerification: {
          status: 'idle' as const,
          error: undefined,
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

  it('allows switching forms even with expired session', () => {
    const expiredSession = {
      ...defaultMfaSession,
      expiresAt: Date.now() - 1000, // Already expired
    };

    const store = setupStore({
      auth: {
        mfaSession: expiredSession,
        authentication: {
          status: 'idle' as const,
          requestId: 'test-request-id',
          data: null,
        },
        mfaVerification: {
          status: 'idle' as const,
          error: undefined,
        },
        isAuthorized: false,
        isLogoutInProgress: false,
      },
    });

    render(
      <Provider store={store}>
        <AuthFlow />
      </Provider>,
    );

    // Should show MFA form initially (even with expired session)
    expect(screen.getByTestId('mfa-form')).toBeInTheDocument();

    // Click to switch to Recovery with expired session
    const switchToRecoveryButton = screen.getByText('Switch to Recovery');
    fireEvent.click(switchToRecoveryButton);

    // Should switch to recovery form (form will handle the expiry)
    expect(screen.getByTestId('recovery-form')).toBeInTheDocument();
    // Session is still present (form will handle clearing it)
    expect(store.getState().auth.mfaSession).toBeDefined();
  });

  it('does NOT clear MFA session on unmount (allows retry)', () => {
    const store = setupStore({
      auth: {
        mfaSession: defaultMfaSession,
        authentication: {
          status: 'idle' as const,
          requestId: 'test-request-id',
          data: null,
        },
        mfaVerification: {
          status: 'idle' as const,
          error: undefined,
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

    // Clear any dispatch calls from render
    dispatchSpy.mockClear();

    // Unmount the component
    unmount();

    // Should NOT dispatch clearMFASession (allows user to retry)
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
        mfaVerification: {
          status: 'idle' as const,
          error: undefined,
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

  it('keeps MFA form visible when session is cleared (no automatic redirect)', () => {
    const store = setupStore({
      auth: {
        mfaSession: defaultMfaSession,
        authentication: {
          status: 'idle' as const,
          requestId: 'test-request-id',
          data: null,
        },
        mfaVerification: {
          status: 'idle' as const,
          error: undefined,
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

    // Clear MFA session (e.g., session expired)
    store.dispatch(auth.actions.clearMFASession());

    // Re-render to see the state change
    rerender(
      <Provider store={store}>
        <AuthFlow />
      </Provider>,
    );

    // Should STILL show MFA form (no automatic redirect to login)
    expect(screen.getByTestId('mfa-form')).toBeInTheDocument();
    expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();
  });
});

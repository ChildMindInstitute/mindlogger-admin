import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { MFAForm } from './MFAForm';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('shared/utils/mixpanel', () => ({
  Mixpanel: {
    track: vi.fn(),
    login: vi.fn(),
  },
}));

describe('MFAForm', () => {
  const defaultMfaSession = {
    token: 'mfa-token-123',
    sessionId: 'session-123',
    attempts: 0,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes from now
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderMFAForm = (preloadedState = {}, onSwitchToRecovery?: () => void) => {
    const defaultState = {
      auth: {
        mfaSession: defaultMfaSession,
        authentication: {
          status: 'idle' as const,
          requestId: 'test-request-id',
          data: null,
        },
        isAuthorized: false,
        isLoggedIn: false,
        isLogoutInProgress: false,
        user: null,
      },
    };

    const state = {
      ...defaultState,
      ...preloadedState,
    };

    const { store } = renderWithProviders(<MFAForm onSwitchToRecovery={onSwitchToRecovery} />, {
      preloadedState: state,
    });

    return { store };
  };

  it('renders MFA form correctly', () => {
    renderMFAForm();

    expect(screen.getByText('Confirm Your Identity')).toBeInTheDocument();
    expect(
      screen.getByText('Please enter the verification code shown in your authenticator app.'),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Verification code')).toBeInTheDocument();
    expect(screen.getByText("I can't access my authenticator app")).toBeInTheDocument();
    expect(screen.getByText('Continue')).toBeInTheDocument();
  });

  it('allows entering the verification code', async () => {
    renderMFAForm();
    const input = screen.getByLabelText('Verification code') as HTMLInputElement;

    await userEvent.type(input, '123');

    expect(input).toHaveValue('123');
  });

  it.skip('validates 6-digit code format', async () => {
    renderMFAForm();
    const input = screen.getByLabelText('Verification code');
    const submitButton = screen.getByText('Continue');

    // First test - empty field (required validation)
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Verification code is required')).toBeInTheDocument();
    });

    // Test invalid input (less than 6 digits)
    await userEvent.clear(input);
    await userEvent.type(input, '12345');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Code must be 6 digits')).toBeInTheDocument();
    });

    // Test valid input
    await userEvent.clear(input);
    await userEvent.type(input, '123456');

    // Should not show error for valid input
    await waitFor(() => {
      expect(screen.queryByText('Code must be 6 digits')).not.toBeInTheDocument();
    });
  });

  it.skip('auto-submits when 6 digits are entered', async () => {
    const { store } = renderMFAForm();
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    const input = screen.getByLabelText('Verification code');

    // Type 6 digits
    await userEvent.type(input, '123456');

    await waitFor(() => {
      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: expect.stringContaining('verifyMFATOTP'),
          payload: {
            totpCode: '123456',
            mfaToken: 'mfa-token-123',
            sessionId: 'session-123',
          },
        }),
      );
    });
  });

  it.skip('clears error on input change', async () => {
    const errorState = {
      auth: {
        mfaSession: defaultMfaSession,
        authentication: {
          status: 'failed' as const,
          requestId: 'test-request-id',
          data: null,
          error: { message: 'Invalid TOTP code' },
        },
        isAuthorized: false,
        isLoggedIn: false,
        user: null,
      },
    };

    renderMFAForm(errorState);

    // Verify error is shown
    expect(screen.getByText('Invalid verification code. Please try again')).toBeInTheDocument();

    const input = screen.getByLabelText('Verification code');

    // Type to clear error
    await userEvent.type(input, '1');

    await waitFor(() => {
      expect(
        screen.queryByText('Invalid verification code. Please try again'),
      ).not.toBeInTheDocument();
    });
  });

  it('shows warning after 3 attempts', () => {
    const attemptState = {
      auth: {
        mfaSession: { ...defaultMfaSession, attempts: 3 },
        authentication: {
          status: 'idle' as const,
          requestId: 'test-request-id',
          data: null,
        },
        isAuthorized: false,
        isLoggedIn: false,
        isLogoutInProgress: false,
        user: null,
      },
    };

    renderMFAForm(attemptState);

    expect(screen.getByText(/attempts remaining/)).toBeInTheDocument();
  });

  it.skip('handles session expiry', async () => {
    const expiredState = {
      auth: {
        mfaSession: {
          ...defaultMfaSession,
          expiresAt: Date.now() - 1000, // Expired
        },
        authentication: {
          status: 'idle' as const,
          requestId: 'test-request-id',
          data: null,
        },
        isAuthorized: false,
        isLoggedIn: false,
        isLogoutInProgress: false,
        user: null,
      },
    };

    const { store } = renderMFAForm(expiredState);

    await waitFor(() => {
      expect(
        screen.getByText('Your session has expired. Please log in again.'),
      ).toBeInTheDocument();
    });

    await waitFor(
      () => {
        const state = store.getState();
        expect(state.auth.mfaSession).toBeNull();
        expect(mockNavigate).toHaveBeenCalledWith('/login');
      },
      { timeout: 4000 },
    );
  });

  it('navigates to recovery code form when link clicked', async () => {
    const mockSwitchToRecovery = vi.fn();
    renderMFAForm({}, mockSwitchToRecovery);

    const recoveryLink = screen.getByText("I can't access my authenticator app");
    fireEvent.click(recoveryLink);

    expect(mockSwitchToRecovery).toHaveBeenCalled();
  });

  it.skip('restricts input to 6 digits only', async () => {
    renderMFAForm();
    const input = screen.getByLabelText('Verification code') as HTMLInputElement;

    await userEvent.type(input, '1234567890');
    expect(input.value).toBe('123456');
  });

  it('disables submit button when submitting', async () => {
    const submittingState = {
      auth: {
        mfaSession: defaultMfaSession,
        authentication: {
          status: 'loading' as const,
          requestId: 'test-request-id',
          data: null,
        },
        isAuthorized: false,
        isLoggedIn: false,
        isLogoutInProgress: false,
        user: null,
      },
    };

    renderMFAForm(submittingState);

    const submitButton = screen.getByText('Continue') as HTMLButtonElement;
    expect(submitButton.disabled).toBe(true);
  });
});

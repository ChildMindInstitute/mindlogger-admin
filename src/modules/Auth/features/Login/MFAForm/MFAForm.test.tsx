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

    expect(screen.getByText('confirmYourIdentity')).toBeInTheDocument();
    expect(screen.getByText('enterVerificationCode')).toBeInTheDocument();
    expect(screen.getByLabelText('verificationCode')).toBeInTheDocument();
    expect(screen.getByText('cantAccessAuthenticator')).toBeInTheDocument();
    expect(screen.getByText('continue')).toBeInTheDocument();
  });

  it('validates 6-digit code format', async () => {
    renderMFAForm();
    const input = screen.getByLabelText('verificationCode');
    const submitButton = screen.getByText('continue');

    // Test invalid input (less than 6 digits)
    await userEvent.type(input, '12345');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('mfaCodeFormat')).toBeInTheDocument();
    });

    // Test invalid input (non-numeric)
    await userEvent.clear(input);
    await userEvent.type(input, 'abc123');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('mfaCodeFormat')).toBeInTheDocument();
    });
  });

  it('auto-submits when 6 digits are entered', async () => {
    const { store } = renderMFAForm();
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    const input = screen.getByLabelText('verificationCode');

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

  it('clears error on input change', async () => {
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
    expect(screen.getByText('invalidCode')).toBeInTheDocument();

    const input = screen.getByLabelText('verificationCode');

    // Type to clear error
    await userEvent.type(input, '1');

    await waitFor(() => {
      expect(screen.queryByText('invalidCode')).not.toBeInTheDocument();
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

    expect(screen.getByText('attemptsRemaining')).toBeInTheDocument();
  });

  it('handles session expiry', async () => {
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
      expect(screen.getByText('mfaSessionExpired')).toBeInTheDocument();
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

    const recoveryLink = screen.getByText('cantAccessAuthenticator');
    fireEvent.click(recoveryLink);

    expect(mockSwitchToRecovery).toHaveBeenCalled();
  });

  it('restricts input to 6 digits only', async () => {
    renderMFAForm();
    const input = screen.getByLabelText('verificationCode') as HTMLInputElement;

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

    const submitButton = screen.getByText('continue') as HTMLButtonElement;
    expect(submitButton.disabled).toBe(true);
  });
});

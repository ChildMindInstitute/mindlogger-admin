import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { RecoveryCodeForm } from './RecoveryCodeForm';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('RecoveryCodeForm', () => {
  // MFA session only contains backend-provided tokens
  // Session expiry and attempts are tracked by the backend
  const defaultMfaSession = {
    token: 'mfa-token-123',
    sessionId: 'session-123',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const renderRecoveryCodeForm = (preloadedState = {}, onSwitchToTOTP?: () => void) => {
    const defaultState = {
      auth: {
        mfaSession: defaultMfaSession,
        authentication: {
          status: 'idle' as const,
          requestId: 'test-request-id',
          data: null,
        },
        totpVerification: {
          status: 'idle' as const,
        },
        recoveryVerification: {
          status: 'idle' as const,
        },
        isSessionExpired: false,
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

    const { store } = renderWithProviders(<RecoveryCodeForm onSwitchToTOTP={onSwitchToTOTP} />, {
      preloadedState: state,
    });

    return { store };
  };

  it('renders recovery code form correctly', () => {
    renderRecoveryCodeForm();

    expect(screen.getByText('Confirm Your Identity')).toBeInTheDocument();
    expect(screen.getByText('Please enter an account recovery code.')).toBeInTheDocument();
    expect(screen.getByLabelText('Recovery code')).toBeInTheDocument();
    expect(screen.getByText('Back')).toBeInTheDocument();
    expect(screen.getByText('Continue')).toBeInTheDocument();
  });

  it.skip('validates recovery code format', async () => {
    renderRecoveryCodeForm();
    const input = screen.getByLabelText('Recovery code');
    const submitButton = screen.getByText('Continue');

    // Test invalid format
    await userEvent.type(input, 'INVALID-CODE');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Recovery code must be in format XXXXX-XXXXX')).toBeInTheDocument();
    });

    // Test valid format
    await userEvent.clear(input);
    await userEvent.type(input, 'ABCDE-12345');

    await waitFor(() => {
      expect(
        screen.queryByText('Recovery code must be in format XXXXX-XXXXX'),
      ).not.toBeInTheDocument();
    });
  });

  it.skip('auto-formats recovery code input', async () => {
    renderRecoveryCodeForm();
    const input = screen.getByLabelText('Recovery code') as HTMLInputElement;

    // Clear and type without hyphen
    await userEvent.clear(input);
    await userEvent.type(input, 'abcde12345');

    // The input should show the formatted value
    await waitFor(() => {
      expect(input.value).toBe('ABCDE-12345');
    });
  });

  it.skip('clears error on input change', async () => {
    renderRecoveryCodeForm();
    const input = screen.getByLabelText('Recovery code');
    const submitButton = screen.getByText('Continue');

    // Create an error
    await userEvent.type(input, 'WRONG');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Recovery code must be in format XXXXX-XXXXX')).toBeInTheDocument();
    });

    // Clear error by typing
    await userEvent.type(input, 'A');

    await waitFor(() => {
      expect(
        screen.queryByText('Recovery code must be in format XXXXX-XXXXX'),
      ).not.toBeInTheDocument();
    });
  });

  it('handles session expiry from backend response', () => {
    // Session expiry is now detected via backend error response
    // Backend sets isSessionExpired flag when session times out
    const expiredState = {
      auth: {
        mfaSession: defaultMfaSession,
        authentication: {
          status: 'idle' as const,
          requestId: 'test-request-id',
          data: null,
        },
        totpVerification: {
          status: 'idle' as const,
        },
        recoveryVerification: {
          status: 'error' as const,
          displayError: 'mfaSessionExpired',
        },
        isSessionExpired: true, // Set by backend response
        isAuthorized: false,
        isLoggedIn: false,
        isLogoutInProgress: false,
        user: null,
      },
    };

    renderRecoveryCodeForm(expiredState);

    expect(screen.getByText('Your session has expired. Please log in again.')).toBeInTheDocument();
  });

  it('navigates back to TOTP form when link clicked', async () => {
    const mockSwitchToTOTP = vi.fn();
    renderRecoveryCodeForm({}, mockSwitchToTOTP);

    const backButton = screen.getByText('Back');
    fireEvent.click(backButton);

    expect(mockSwitchToTOTP).toHaveBeenCalled();
  });

  it.skip('handles API errors correctly', async () => {
    const errorState = {
      auth: {
        mfaSession: defaultMfaSession,
        authentication: {
          status: 'failed' as const,
          requestId: 'test-request-id',
          data: null,
          error: { message: 'Invalid recovery code' },
        },
        isAuthorized: false,
        isLoggedIn: false,
        user: null,
      },
    };

    renderRecoveryCodeForm(errorState);

    expect(screen.getByText('Invalid recovery code. Please try again')).toBeInTheDocument();
  });

  it.skip('handles successful verification', async () => {
    const { store } = renderRecoveryCodeForm();
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    const input = screen.getByLabelText('Recovery code');
    const submitButton = screen.getByText('Continue');

    await userEvent.type(input, 'ABCDE-12345');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: expect.stringContaining('verifyMFARecoveryCode'),
          payload: {
            code: 'ABCDE-12345',
            mfaToken: 'mfa-token-123',
            sessionId: 'session-123',
          },
        }),
      );
    });
  });

  it.skip('restricts input to 11 characters (including hyphen)', async () => {
    renderRecoveryCodeForm();
    const input = screen.getByLabelText('Recovery code') as HTMLInputElement;

    await userEvent.clear(input);
    await userEvent.type(input, 'ABCDEFGHIJK12345');

    // Should only keep first 10 characters plus hyphen
    await waitFor(() => {
      expect(input.value).toBe('ABCDE-FGHIJ');
    });
  });

  it('disables submit button when submitting', async () => {
    const { store } = renderRecoveryCodeForm();
    const mockDispatch = vi.spyOn(store, 'dispatch');

    // Mock a slow async verification to keep isSubmitting true
    mockDispatch.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ type: 'fulfilled' }), 1000)),
    );

    const input = screen.getByLabelText('Recovery code') as HTMLInputElement;
    const submitButton = screen.getByText('Continue') as HTMLButtonElement;

    // Enter a recovery code
    await userEvent.type(input, 'ABCDE-12345');

    // Click submit button
    fireEvent.click(submitButton);

    // The button should be disabled while submitting
    await waitFor(() => {
      expect(submitButton.disabled).toBe(true);
    });
  });

  it.skip('removes non-alphanumeric characters from input', async () => {
    renderRecoveryCodeForm();
    const input = screen.getByLabelText('Recovery code') as HTMLInputElement;

    await userEvent.clear(input);
    await userEvent.type(input, 'AB!CD@E-12#34$5');

    // Should only keep alphanumeric characters
    await waitFor(() => {
      expect(input.value).toBe('ABCDE-12345');
    });
  });
});

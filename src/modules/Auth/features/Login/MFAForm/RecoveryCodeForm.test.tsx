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

vi.mock('shared/utils/mixpanel', () => ({
  Mixpanel: {
    track: vi.fn(),
  },
}));

describe('RecoveryCodeForm', () => {
  const defaultMfaSession = {
    token: 'mfa-token-123',
    sessionId: 'session-123',
    attempts: 0,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes from now
  };

  beforeEach(() => {
    vi.clearAllMocks();
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

    expect(screen.getByText('useRecoveryCode')).toBeInTheDocument();
    expect(screen.getByText('enterOneRecoveryCode')).toBeInTheDocument();
    expect(screen.getByLabelText('recoveryCode')).toBeInTheDocument();
    expect(screen.getByText('backToAuthenticator')).toBeInTheDocument();
    expect(screen.getByText('continue')).toBeInTheDocument();
  });

  it('validates recovery code format', async () => {
    renderRecoveryCodeForm();
    const input = screen.getByLabelText('recoveryCode');
    const submitButton = screen.getByText('continue');

    // Test invalid format
    await userEvent.type(input, 'INVALID-CODE');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('recoveryCodeFormat')).toBeInTheDocument();
    });

    // Test valid format
    await userEvent.clear(input);
    await userEvent.type(input, 'ABCDE-12345');

    await waitFor(() => {
      expect(screen.queryByText('recoveryCodeFormat')).not.toBeInTheDocument();
    });
  });

  it('auto-formats recovery code input', async () => {
    renderRecoveryCodeForm();
    const input = screen.getByLabelText('recoveryCode') as HTMLInputElement;

    // Type without hyphen
    await userEvent.type(input, 'abcde12345');

    // Should auto-format to uppercase with hyphen
    expect(input.value).toBe('ABCDE-12345');
  });

  it('clears error on input change', async () => {
    renderRecoveryCodeForm();
    const input = screen.getByLabelText('recoveryCode');
    const submitButton = screen.getByText('continue');

    // Create an error
    await userEvent.type(input, 'WRONG');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('recoveryCodeFormat')).toBeInTheDocument();
    });

    // Clear error by typing
    await userEvent.type(input, 'A');

    await waitFor(() => {
      expect(screen.queryByText('recoveryCodeFormat')).not.toBeInTheDocument();
    });
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

    const { store } = renderRecoveryCodeForm(expiredState);

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

  it('navigates back to TOTP form when link clicked', async () => {
    const mockSwitchToTOTP = vi.fn();
    renderRecoveryCodeForm({}, mockSwitchToTOTP);

    const backLink = screen.getByText('backToAuthenticator');
    fireEvent.click(backLink);

    expect(mockSwitchToTOTP).toHaveBeenCalled();
  });

  it('handles API errors correctly', async () => {
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

    expect(screen.getByText('invalidRecoveryCode')).toBeInTheDocument();
  });

  it('handles successful verification', async () => {
    const { store } = renderRecoveryCodeForm();
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    const input = screen.getByLabelText('recoveryCode');
    const submitButton = screen.getByText('continue');

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

  it('restricts input to 11 characters (including hyphen)', async () => {
    renderRecoveryCodeForm();
    const input = screen.getByLabelText('recoveryCode') as HTMLInputElement;

    await userEvent.type(input, 'ABCDEFGHIJK12345');

    // Should only keep first 10 characters plus hyphen
    expect(input.value).toBe('ABCDE-FGHIJ');
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

    renderRecoveryCodeForm(submittingState);

    const submitButton = screen.getByText('continue') as HTMLButtonElement;
    expect(submitButton.disabled).toBe(true);
  });

  it('removes non-alphanumeric characters from input', async () => {
    renderRecoveryCodeForm();
    const input = screen.getByLabelText('recoveryCode') as HTMLInputElement;

    await userEvent.type(input, 'AB!CD@E-12#34$5');

    // Should only keep alphanumeric characters
    expect(input.value).toBe('ABCDE-12345');
  });
});

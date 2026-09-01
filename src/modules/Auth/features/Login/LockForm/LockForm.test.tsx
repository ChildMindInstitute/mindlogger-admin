import { fireEvent, screen, waitFor } from '@testing-library/react';

import { mockedEmail, mockedPassword } from 'shared/mock';
import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { LockForm } from '.';

const mockedSignInApi = vi.hoisted(() => vi.fn());

vi.mock('api', async () => ({
  ...(await vi.importActual('api')),
  signInApi: mockedSignInApi,
}));

const lockedAuthState = {
  authentication: {
    status: 'success' as const,
    requestId: 'test-request-id',
    data: {
      user: { id: 'user-1', email: mockedEmail, firstName: 'Ann', lastName: 'Smith' },
    },
  },
  totpVerification: { status: 'idle' as const },
  recoveryVerification: { status: 'idle' as const },
  isSessionExpired: false,
  isAuthorized: false,
  isLogoutInProgress: false,
};

const renderLockForm = (hasSessionElsewhere = false) =>
  renderWithProviders(<LockForm />, {
    preloadedState: { auth: { ...lockedAuthState, hasSessionElsewhere } },
  });

const submitForm = () => {
  fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: mockedPassword } });
  fireEvent.click(screen.getByTestId('lock-form-login'));
};

describe('LockForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedSignInApi.mockClear();
  });

  // The lock screen signs in like any other, so it starts a second session just as readily.
  it('refuses to sign in while another tab holds the session', async () => {
    renderLockForm(true);

    submitForm();

    await waitFor(() => expect(screen.getByTestId('lock-form-login')).toBeDisabled());
    expect(mockedSignInApi).not.toHaveBeenCalled();
  });

  it('leaves the button usable until it is pressed', () => {
    renderLockForm(true);

    expect(screen.getByTestId('lock-form-login')).toBeEnabled();
  });

  it('signs in as usual when no other session is running', async () => {
    mockedSignInApi.mockResolvedValue({
      data: {
        result: {
          user: { id: 'user-1', email: mockedEmail, firstName: 'Ann', lastName: 'Smith' },
          token: { accessToken: 'access', refreshToken: 'refresh' },
        },
      },
    });
    renderLockForm();

    submitForm();

    await waitFor(() => expect(mockedSignInApi).toHaveBeenCalledTimes(1));
  });
});

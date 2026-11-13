import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { page } from 'resources';
import { renderWithProviders } from 'shared/utils/renderWithProviders';

import AcceptMsa from './AcceptMsa';

const mockedAcceptMSAAtLoginApi = vi.hoisted(() => vi.fn());

vi.mock('api', async () => ({
  ...(await vi.importActual('api')),
  acceptMSAAtLoginApi: mockedAcceptMSAAtLoginApi,
}));

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const preloadedState = {
  auth: {
    msaSession: {
      token: 'msa-token',
      version: '2026-11-01',
      email: 'admin@example.com',
      deadline: null,
    },
    authentication: { status: 'idle' as const, requestId: '', data: null },
    totpVerification: { status: 'idle' as const },
    recoveryVerification: { status: 'idle' as const },
    isSessionExpired: false,
    isAuthorized: false,
    isLogoutInProgress: false,
  },
};

describe('AcceptMsa', () => {
  it('accepts the MSA and goes to the dashboard', async () => {
    mockedAcceptMSAAtLoginApi.mockResolvedValueOnce({
      data: {
        result: {
          token: { accessToken: 'access', refreshToken: 'refresh' },
          user: { id: 'user-id', email: 'admin@example.com', firstName: 'A', lastName: 'B' },
        },
      },
    });
    renderWithProviders(<AcceptMsa />, { preloadedState });

    expect(screen.getByText('Signed in as admin@example.com')).toBeInTheDocument();

    await userEvent.click(
      screen.getByLabelText('I have read and agree to the Master Services Agreement.'),
    );
    await userEvent.click(screen.getByRole('button', { name: 'Accept and continue' }));

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith(page.dashboard));
  });

  it('shows the deadline copy when the grace period has ended', () => {
    renderWithProviders(<AcceptMsa />, {
      preloadedState: {
        auth: {
          ...preloadedState.auth,
          msaSession: { ...preloadedState.auth.msaSession, deadline: '2026-12-11' },
        },
      },
    });

    expect(
      screen.getByText('Accept the updated Master Services Agreement to continue to Curious Admin'),
    ).toBeInTheDocument();
    expect(screen.getByText('December 11, 2026').tagName).toBe('STRONG');
  });

  it('returns to the soft-locked page after accepting', async () => {
    mockedAcceptMSAAtLoginApi.mockResolvedValueOnce({
      data: {
        result: {
          token: { accessToken: 'access', refreshToken: 'refresh' },
          user: { id: 'user-id', email: 'admin@example.com', firstName: 'A', lastName: 'B' },
        },
      },
    });
    renderWithProviders(<AcceptMsa />, {
      preloadedState: {
        auth: {
          ...preloadedState.auth,
          softLockData: {
            email: 'admin@example.com',
            redirectTo: '/builder/applet-id',
            workspace: null,
          },
        },
      },
    });

    await userEvent.click(
      screen.getByLabelText('I have read and agree to the Master Services Agreement.'),
    );
    await userEvent.click(screen.getByRole('button', { name: 'Accept and continue' }));

    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith('/builder/applet-id', {
        state: { workspace: null },
      }),
    );
  });

  it('sends the user back to log in when the MSA token has expired', async () => {
    mockedAcceptMSAAtLoginApi.mockRejectedValueOnce({
      response: { data: { error_code: 'AUTH.MSA.TOKEN_EXPIRED' } },
    });
    renderWithProviders(<AcceptMsa />, { preloadedState });

    await userEvent.click(
      screen.getByLabelText('I have read and agree to the Master Services Agreement.'),
    );
    await userEvent.click(screen.getByRole('button', { name: 'Accept and continue' }));

    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith(page.login, {
        replace: true,
        state: { loginError: 'Your session has expired. Please log in again.' },
      }),
    );
  });
});

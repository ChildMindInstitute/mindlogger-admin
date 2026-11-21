import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { authApiClient } from 'shared/api/apiConfig';
import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { MsaGracePrompt } from './MsaGracePrompt';

const graceStatus = { status: 'grace', version: '2026-11-01', deadline: '2026-12-11' };

const preloadedState = {
  auth: {
    authentication: { status: 'idle' as const, requestId: '', data: null },
    totpVerification: { status: 'idle' as const },
    recoveryVerification: { status: 'idle' as const },
    isSessionExpired: false,
    isAuthorized: true,
    isLogoutInProgress: false,
    msaPromptPending: true,
  },
};

describe('MsaGracePrompt', () => {
  beforeEach(() => {
    vi.mocked(authApiClient.get).mockResolvedValue({ data: { result: graceStatus } });
  });

  it('shows after sign-in during the grace period', async () => {
    renderWithProviders(<MsaGracePrompt />, { preloadedState });

    expect(
      await screen.findByText("We've updated our Master Services Agreement"),
    ).toBeInTheDocument();
    expect(screen.getByText('Accept by December 11, 2026')).toBeInTheDocument();
  });

  it('closes when the user chooses to be reminded later', async () => {
    const { store } = renderWithProviders(<MsaGracePrompt />, { preloadedState });

    await userEvent.click(await screen.findByRole('button', { name: 'Remind me later' }));

    await waitFor(() => expect(screen.queryByTestId('msa-grace-prompt')).not.toBeInTheDocument());
    expect(store.getState().auth.msaPromptPending).toBe(false);
  });
});

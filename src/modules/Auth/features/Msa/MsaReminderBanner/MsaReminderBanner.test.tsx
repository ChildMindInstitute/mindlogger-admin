import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { authApiClient } from 'shared/api/apiConfig';
import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { MsaReminderBanner } from './MsaReminderBanner';

describe('MsaReminderBanner', () => {
  // The banner's colour depends on how many days are left, so today is fixed
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-10-16T12:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows the deadline during the grace period', async () => {
    vi.mocked(authApiClient.get).mockResolvedValue({
      data: { result: { status: 'grace', version: '2026-11-01', deadline: '2026-12-11' } },
    });
    renderWithProviders(<MsaReminderBanner />);

    expect(await screen.findByTestId('msa-reminder-banner')).toHaveTextContent(
      'Accept the updated Master Services Agreement by December 11, 2026 to keep using Curious Admin.',
    );
    expect(screen.getByText('December 11, 2026').tagName).toBe('STRONG');
  });

  it('reopens the MSA prompt from the review link', async () => {
    vi.mocked(authApiClient.get).mockResolvedValue({
      data: { result: { status: 'grace', version: '2026-11-01', deadline: '2026-12-11' } },
    });
    const { store } = renderWithProviders(<MsaReminderBanner />);

    await userEvent.click(await screen.findByRole('button', { name: 'Review and accept' }));

    expect(store.getState().auth.msaPromptPending).toBe(true);
  });

  it('turns red in the final days before the deadline', async () => {
    vi.mocked(authApiClient.get).mockResolvedValue({
      data: { result: { status: 'grace', version: '2026-11-01', deadline: '2026-10-20' } },
    });
    renderWithProviders(<MsaReminderBanner />);

    expect(await screen.findByTestId('msa-reminder-banner')).toHaveTextContent(
      'Your access to Curious Admin pauses after October 20, 2026 unless you accept the updated Master Services Agreement.',
    );
    expect(screen.getByRole('alert')).toHaveClass('MuiAlert-standardError');
  });
});

import { screen } from '@testing-library/react';

import { authApiClient } from 'shared/api/apiConfig';
import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { MsaReminderBanner } from './MsaReminderBanner';

describe('MsaReminderBanner', () => {
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
});

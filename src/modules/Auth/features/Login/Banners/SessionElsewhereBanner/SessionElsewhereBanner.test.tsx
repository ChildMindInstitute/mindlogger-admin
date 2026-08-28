import { screen, fireEvent } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { SessionElsewhereBanner } from './SessionElsewhereBanner';

const mockReload = vi.fn();

describe('SessionElsewhereBanner', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...window.location, reload: mockReload },
    });
  });

  test('tells the user a session is running elsewhere', () => {
    renderWithProviders(<SessionElsewhereBanner />);

    expect(screen.getByTestId('session-elsewhere-banner')).toHaveTextContent(
      'You signed in with another tab or window. Reload to refresh your session.',
    );
  });

  test('the reload link reloads the tab into the running session', () => {
    renderWithProviders(<SessionElsewhereBanner />);

    fireEvent.click(screen.getByRole('button', { name: 'Reload' }));

    expect(mockReload).toHaveBeenCalledTimes(1);
  });
});

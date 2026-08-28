import { screen, fireEvent } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { SessionStorageKeys } from 'shared/utils/storage';

import { SessionElsewhereBanner } from './SessionElsewhereBanner';

const mockReload = vi.fn();

describe('SessionElsewhereBanner', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
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

  // Left by leaveEndedSession to keep this boot out of the session. Reloading is the user asking
  // to go in, so it cannot survive and turn the next boot away too.
  test('clears the ended marker on the way, so the reload lands in the session', () => {
    sessionStorage.setItem(SessionStorageKeys.SessionEnded, 'true');
    renderWithProviders(<SessionElsewhereBanner />);

    fireEvent.click(screen.getByRole('button', { name: 'Reload' }));

    expect(sessionStorage.getItem(SessionStorageKeys.SessionEnded)).toBeNull();
  });
});

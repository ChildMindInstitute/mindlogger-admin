import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useLocation } from 'react-router-dom';

import { AuthSchema, initialStateData } from 'redux/modules';
import { mockedOwnerId } from 'shared/mock';
import { getPreloadedState } from 'shared/tests/getPreloadedState';
import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { GLOBAL_DISMISSED_KEY, RebrandBanner, getDismissedKey } from './RebrandBanner';

const bannerTestId = 'rebrand-banner';

// Mock useLocation hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn().mockImplementation(() => ({
    pathname: '/dashboard/applets',
  })),
}));

describe('RebrandBanner', () => {
  // Get the mocked useLocation function
  const mockedUseLocation = useLocation as jest.Mock;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();

    // Reset location mock to default
    mockedUseLocation.mockImplementation(() => ({
      pathname: '/dashboard/applets',
    }));
  });

  const mockAuthState: { auth: AuthSchema } = {
    auth: {
      authentication: {
        ...initialStateData,
        data: {
          user: {
            id: mockedOwnerId,
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
          },
        },
      },
      isAuthorized: true,
      isLogoutInProgress: false,
    },
  };

  // Anonymous user state (for auth screen tests)
  const mockAnonymousState = {
    auth: {
      authentication: {
        ...initialStateData,
        data: null,
      },
      isAuthorized: false,
      isLogoutInProgress: false,
    },
  };

  describe('Rebrand Banner behavior for logged-in users', () => {
    test('shows banner when not dismissed', () => {
      renderWithProviders(<RebrandBanner />, {
        preloadedState: {
          ...getPreloadedState(),
          ...mockAuthState,
        },
      });

      expect(screen.getByTestId(bannerTestId)).toBeInTheDocument();
    });

    test('hides banner when dismissed', async () => {
      renderWithProviders(<RebrandBanner />, {
        preloadedState: {
          ...getPreloadedState(),
          ...mockAuthState,
        },
      });

      const banner = screen.getByTestId(bannerTestId);
      expect(banner).toBeInTheDocument();

      // Click close button
      await userEvent.click(within(banner).getByRole('button'));

      // Check localStorage was set for both user-level and workspace-level
      expect(localStorage.getItem(getDismissedKey(mockedOwnerId))).toBe('true');
      expect(localStorage.getItem(getDismissedKey(mockedOwnerId, mockedOwnerId))).toBe('true');
    });

    test('does not show banner when user-level dismissal exists', () => {
      // Set user-level dismissal
      localStorage.setItem(getDismissedKey(mockedOwnerId), 'true');

      renderWithProviders(<RebrandBanner />, {
        preloadedState: {
          ...getPreloadedState(),
          ...mockAuthState,
        },
      });

      expect(screen.queryByTestId(bannerTestId)).not.toBeInTheDocument();
    });

    test('does not show banner when workspace-level dismissal exists', () => {
      // Set workspace-level dismissal
      localStorage.setItem(getDismissedKey(mockedOwnerId, mockedOwnerId), 'true');

      renderWithProviders(<RebrandBanner />, {
        preloadedState: {
          ...getPreloadedState(),
          ...mockAuthState,
        },
      });

      expect(screen.queryByTestId(bannerTestId)).not.toBeInTheDocument();
    });

    test('does not show banner on non-display routes', () => {
      // Set location to a non-display route
      mockedUseLocation.mockImplementation(() => ({
        pathname: '/dashboard/applets/some-applet-id',
      }));

      renderWithProviders(<RebrandBanner />, {
        preloadedState: {
          ...getPreloadedState(),
          ...mockAuthState,
        },
      });

      expect(screen.queryByTestId(bannerTestId)).not.toBeInTheDocument();
    });
  });

  describe('Rebrand Banner behavior on auth screen', () => {
    beforeEach(() => {
      // Set location to auth route
      mockedUseLocation.mockImplementation(() => ({
        pathname: '/auth',
      }));
    });

    test('shows banner on auth screen when not dismissed', () => {
      renderWithProviders(<RebrandBanner />, {
        preloadedState: {
          ...getPreloadedState(),
          ...mockAnonymousState,
        },
      });

      expect(screen.getByTestId(bannerTestId)).toBeInTheDocument();
    });

    test('hides banner on auth screen when dismissed', async () => {
      renderWithProviders(<RebrandBanner />, {
        preloadedState: {
          ...getPreloadedState(),
          ...mockAnonymousState,
        },
      });

      const banner = screen.getByTestId(bannerTestId);
      expect(banner).toBeInTheDocument();

      // Click close button
      await userEvent.click(within(banner).getByRole('button'));

      // Check global dismissal was set
      expect(localStorage.getItem(GLOBAL_DISMISSED_KEY)).toBe('true');
    });

    test('does not show banner on auth screen when globally dismissed', () => {
      // Set global dismissal
      localStorage.setItem(GLOBAL_DISMISSED_KEY, 'true');

      renderWithProviders(<RebrandBanner />, {
        preloadedState: {
          ...getPreloadedState(),
          ...mockAnonymousState,
        },
      });

      expect(screen.queryByTestId(bannerTestId)).not.toBeInTheDocument();
    });
  });
});

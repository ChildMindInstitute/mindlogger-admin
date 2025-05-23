import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AuthSchema, initialStateData } from 'redux/modules';
import { mockedOwnerId } from 'shared/mock';
import { getPreloadedState } from 'shared/tests/getPreloadedState';
import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { RebrandBanner, getDismissedKey } from './RebrandBanner';

const bannerTestId = 'rebrand-banner';

describe('RebrandBanner', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
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

  describe('Rebrand Banner behavior', () => {
    test('shows banner not dismissed', () => {
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

      // Check localStorage was set
      expect(localStorage.getItem(getDismissedKey(mockedOwnerId, mockedOwnerId))).toBe('true');
    });
  });
});

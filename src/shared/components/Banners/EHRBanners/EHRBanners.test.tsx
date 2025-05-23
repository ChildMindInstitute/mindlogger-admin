import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { useFeatureFlags } from 'shared/hooks';
import { getPreloadedState } from 'shared/tests/getPreloadedState';
import { Roles } from 'shared/consts';
import { AuthSchema, initialStateData } from 'redux/modules';
import { mockedOwnerId } from 'shared/mock';

import { EHRBanners, getDismissedKey } from './EHRBanners';

const activeTestId = 'ehr-banner-active';
const availableTestId = 'ehr-banner-available';

vi.mock('shared/hooks', () => ({
  useFeatureFlags: vi.fn(),
}));

const mockUseFeatureFlags = useFeatureFlags as jest.Mock;

describe('EHRBanners', () => {
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

  describe('EHR Banner behavior', () => {
    test('shows available banner when feature flag is available and not dismissed', () => {
      mockUseFeatureFlags.mockReturnValue({
        featureFlags: { enableEhrHealthData: 'available' },
      });

      renderWithProviders(<EHRBanners />, {
        preloadedState: {
          ...getPreloadedState(Roles.Manager),
          ...mockAuthState,
        },
      });

      expect(screen.getByTestId(availableTestId)).toBeInTheDocument();
      expect(screen.queryByTestId(activeTestId)).not.toBeInTheDocument();
    });

    test('shows active banner when feature flag is active and not dismissed', () => {
      mockUseFeatureFlags.mockReturnValue({
        featureFlags: { enableEhrHealthData: 'active' },
      });

      renderWithProviders(<EHRBanners />, {
        preloadedState: {
          ...getPreloadedState(Roles.Manager),
          ...mockAuthState,
        },
      });

      expect(screen.getByTestId(activeTestId)).toBeInTheDocument();
      expect(screen.queryByTestId(availableTestId)).not.toBeInTheDocument();
    });

    test('hides available banner when dismissed', async () => {
      mockUseFeatureFlags.mockReturnValue({
        featureFlags: { enableEhrHealthData: 'available' },
      });

      renderWithProviders(<EHRBanners />, {
        preloadedState: {
          ...getPreloadedState(Roles.Manager),
          ...mockAuthState,
        },
      });

      const banner = screen.getByTestId(availableTestId);
      expect(banner).toBeInTheDocument();

      // Click close button
      await userEvent.click(within(banner).getByRole('button'));

      // Check localStorage was set
      expect(localStorage.getItem(getDismissedKey(mockedOwnerId, mockedOwnerId, 'available'))).toBe(
        'true',
      );
    });

    test('hides active banner when dismissed', async () => {
      mockUseFeatureFlags.mockReturnValue({
        featureFlags: { enableEhrHealthData: 'active' },
      });

      renderWithProviders(<EHRBanners />, {
        preloadedState: {
          ...getPreloadedState(Roles.Manager),
          ...mockAuthState,
        },
      });

      const banner = screen.getByTestId(activeTestId);
      expect(banner).toBeInTheDocument();

      // Click close button
      await userEvent.click(within(banner).getByRole('button'));

      // Check that banner is hidden
      await waitFor(() => expect(banner).not.toBeInTheDocument());

      // Check localStorage was set
      expect(localStorage.getItem(getDismissedKey(mockedOwnerId, mockedOwnerId, 'active'))).toBe(
        'true',
      );
    });

    test('does not show banners when feature flag is not set', () => {
      mockUseFeatureFlags.mockReturnValue({
        featureFlags: { enableEhrHealthData: undefined },
      });

      renderWithProviders(<EHRBanners />, {
        preloadedState: {
          ...getPreloadedState(Roles.Manager),
          ...mockAuthState,
        },
      });

      expect(screen.queryByTestId(availableTestId)).not.toBeInTheDocument();
      expect(screen.queryByTestId(activeTestId)).not.toBeInTheDocument();
    });

    test('does not show banners when user has no edit or data access', () => {
      mockUseFeatureFlags.mockReturnValue({
        featureFlags: { enableEhrHealthData: 'available' },
      });

      renderWithProviders(<EHRBanners />, {
        preloadedState: getPreloadedState(Roles.Coordinator),
      });

      expect(screen.queryByTestId(availableTestId)).not.toBeInTheDocument();
      expect(screen.queryByTestId(activeTestId)).not.toBeInTheDocument();
    });
  });
});

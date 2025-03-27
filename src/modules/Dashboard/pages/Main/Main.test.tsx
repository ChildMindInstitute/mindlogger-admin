import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { useFeatureFlags } from 'shared/hooks';
import { LocalStorageKeys } from 'shared/utils';
import { getPreloadedState } from 'shared/tests/getPreloadedState';
import { Roles } from 'shared/consts';

import { Main } from './Main';

jest.mock('shared/hooks', () => ({
  useFeatureFlags: jest.fn(),
}));

const mockUseFeatureFlags = useFeatureFlags as jest.Mock;

describe('Main', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('EHR Banner behavior', () => {
    test('shows available banner when feature flag is available and not dismissed', () => {
      mockUseFeatureFlags.mockReturnValue({
        featureFlags: { enableEhrHealthData: 'available' },
      });

      renderWithProviders(<Main />, {
        preloadedState: getPreloadedState(Roles.Manager),
      });

      expect(screen.getByTestId('ehr-banner-available')).toBeInTheDocument();
      expect(screen.queryByTestId('ehr-banner-active')).not.toBeInTheDocument();
    });

    test('shows active banner when feature flag is active and not dismissed', () => {
      mockUseFeatureFlags.mockReturnValue({
        featureFlags: { enableEhrHealthData: 'active' },
      });

      renderWithProviders(<Main />, {
        preloadedState: getPreloadedState(Roles.Manager),
      });

      expect(screen.getByTestId('ehr-banner-active')).toBeInTheDocument();
      expect(screen.queryByTestId('ehr-banner-available')).not.toBeInTheDocument();
    });

    test('hides available banner when dismissed', async () => {
      mockUseFeatureFlags.mockReturnValue({
        featureFlags: { enableEhrHealthData: 'available' },
      });

      renderWithProviders(<Main />, {
        preloadedState: getPreloadedState(Roles.Manager),
      });

      const banner = screen.getByTestId('ehr-banner-available');
      expect(banner).toBeInTheDocument();

      // Click close button
      await userEvent.click(within(banner).getByRole('button'));

      // Check localStorage was set
      expect(localStorage.getItem(LocalStorageKeys.EHRBannerAvailableDismissed)).toBe('true');
    });

    test('hides active banner when dismissed', async () => {
      mockUseFeatureFlags.mockReturnValue({
        featureFlags: { enableEhrHealthData: 'active' },
      });

      renderWithProviders(<Main />, {
        preloadedState: getPreloadedState(Roles.Manager),
      });

      const banner = screen.getByTestId('ehr-banner-active');
      expect(banner).toBeInTheDocument();

      // Click close button
      await userEvent.click(within(banner).getByRole('button'));

      // Check localStorage was set
      expect(localStorage.getItem(LocalStorageKeys.EHRBannerActiveDismissed)).toBe('true');
    });

    test('does not show banners when feature flag is not set', () => {
      mockUseFeatureFlags.mockReturnValue({
        featureFlags: { enableEhrHealthData: undefined },
      });

      renderWithProviders(<Main />, {
        preloadedState: getPreloadedState(Roles.Manager),
      });

      expect(screen.queryByTestId('ehr-banner-available')).not.toBeInTheDocument();
      expect(screen.queryByTestId('ehr-banner-active')).not.toBeInTheDocument();
    });

    test('does not show banners when user has no edit or data access', () => {
      mockUseFeatureFlags.mockReturnValue({
        featureFlags: { enableEhrHealthData: 'available' },
      });

      renderWithProviders(<Main />, {
        preloadedState: getPreloadedState(Roles.Coordinator),
      });

      expect(screen.queryByTestId('ehr-banner-available')).not.toBeInTheDocument();
      expect(screen.queryByTestId('ehr-banner-active')).not.toBeInTheDocument();
    });
  });
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen } from '@testing-library/react';

import { useFeatureFlags } from 'shared/hooks';
import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { IntegrationsListSetting } from './IntegrationsListSetting';

jest.mock('shared/hooks', () => ({
  useFeatureFlags: jest.fn(),
}));

describe('IntegrationsListSetting', () => {
  test('should render LORIS when enableLorisIntegration is true', () => {
    useFeatureFlags.mockReturnValue({
      featureFlags: {
        enableLorisIntegration: true,
      },
    });

    renderWithProviders(<IntegrationsListSetting />);

    expect(screen.getByText('LORIS')).toBeInTheDocument();
    expect(screen.queryByText('No integrations found')).not.toBeInTheDocument();
  });

  test('should render "No integrations found" message when no integration is enabled', () => {
    useFeatureFlags.mockReturnValue({
      featureFlags: {
        enableLorisIntegration: false,
      },
    });

    renderWithProviders(<IntegrationsListSetting />);

    expect(screen.getByText('No integrations found')).toBeInTheDocument();
  });
});

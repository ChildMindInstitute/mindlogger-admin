// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen } from '@testing-library/react';

import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';
import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { IntegrationsListSetting } from './IntegrationsListSetting';

jest.mock('shared/hooks/useFeatureFlags', () => ({
  useFeatureFlags: jest.fn(),
}));

describe('IntegrationsListSetting', () => {
  test('should render LORIS when enableLorisIntegration is true', () => {
    useFeatureFlags.mockReturnValue({
      enableLorisIntegration: true,
      enableProlificIntegration: false,
    });
    renderWithProviders(<IntegrationsListSetting />);

    expect(screen.getByTestId('loris-integration')).toBeInTheDocument();
    expect(screen.getByTestId('prolific-integration')).not().toBeInTheDocument();
  });

  test('should render Prolific integration when enableProlificIntegration is true', () => {
    useFeatureFlags.mockReturnValue({
      enableLorisIntegration: false,
      enableProlificIntegration: true,
    });
    renderWithProviders(<IntegrationsListSetting />);

    expect(screen.getByTestId('loris-integration')).not().toBeInTheDocument();
    expect(screen.getByTestId('prolific-integration')).toBeInTheDocument();
  });

  test('should render LORIS and Prolific integrations', () => {
    useFeatureFlags.mockReturnValue({
      enableLorisIntegration: true,
      enableProlificIntegration: true,
    });
    renderWithProviders(<IntegrationsListSetting />);

    expect(screen.getByTestId('loris-integration')).not().toBeInTheDocument();
    expect(screen.getByTestId('prolific-integration')).toBeInTheDocument();
  });
});

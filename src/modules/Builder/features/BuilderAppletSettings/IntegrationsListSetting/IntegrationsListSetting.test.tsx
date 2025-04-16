// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { useFeatureFlags } from 'shared/hooks';

import { IntegrationsListSetting } from './IntegrationsListSetting';

jest.mock('shared/hooks', () => ({
  useFeatureFlags: vi.fn(),
}));

describe('IntegrationsListSetting', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should render LORIS when enableLorisIntegration is true', () => {
    (useFeatureFlags as jest.Mock).mockImplementation(() => ({
      featureFlags: {
        enableLorisIntegration: true,
        enableProlificIntegration: false,
      },
    }));

    renderWithProviders(<IntegrationsListSetting />);

    expect(screen.getByTestId('loris-integration')).toBeInTheDocument();
    expect(screen.queryByTestId('prolific-integration')).toBeNull();
  });

  test('should render Prolific integration when enableProlificIntegration is true', () => {
    (useFeatureFlags as jest.Mock).mockImplementation(() => ({
      featureFlags: {
        enableLorisIntegration: false,
        enableProlificIntegration: true,
      },
    }));

    renderWithProviders(<IntegrationsListSetting />);

    expect(screen.queryByTestId('loris-integration')).toBeNull();
    expect(screen.getByTestId('prolific-integration')).toBeInTheDocument();
  });

  test('should render LORIS and Prolific integrations', () => {
    (useFeatureFlags as jest.Mock).mockImplementation(() => ({
      featureFlags: {
        enableLorisIntegration: true,
        enableProlificIntegration: true,
      },
    }));

    renderWithProviders(<IntegrationsListSetting />);

    expect(screen.getByTestId('loris-integration')).toBeInTheDocument();
    expect(screen.getByTestId('prolific-integration')).toBeInTheDocument();
  });
});

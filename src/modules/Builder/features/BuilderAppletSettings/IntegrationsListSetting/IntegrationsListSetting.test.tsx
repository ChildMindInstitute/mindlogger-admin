// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { IntegrationsListSetting } from './IntegrationsListSetting';

describe('IntegrationsListSetting', () => {
  test('should render LORIS when enableLorisIntegration is true', () => {
    renderWithProviders(
      <IntegrationsListSetting lorisIntegration={true} prolificIntegration={false} />,
    );

    expect(screen.getByTestId('loris-integration')).toBeInTheDocument();
    expect(screen.queryByTestId('prolific-integration')).toBeNull();
  });

  test('should render Prolific integration when enableProlificIntegration is true', () => {
    renderWithProviders(
      <IntegrationsListSetting lorisIntegration={false} prolificIntegration={true} />,
    );

    expect(screen.queryByTestId('loris-integration')).toBeNull();
    expect(screen.getByTestId('prolific-integration')).toBeInTheDocument();
  });

  test('should render LORIS and Prolific integrations', () => {
    renderWithProviders(
      <IntegrationsListSetting lorisIntegration={true} prolificIntegration={true} />,
    );

    expect(screen.getByTestId('loris-integration')).toBeInTheDocument();
    expect(screen.getByTestId('prolific-integration')).toBeInTheDocument();
  });
});

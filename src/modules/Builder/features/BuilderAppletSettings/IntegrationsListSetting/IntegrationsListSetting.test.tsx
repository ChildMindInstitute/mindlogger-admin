// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { IntegrationsListSetting } from './IntegrationsListSetting';

describe('IntegrationsListSetting', () => {
  test('should render LORIS when enableLorisIntegration is true', () => {
    renderWithProviders(<IntegrationsListSetting />);

    expect(screen.getByTestId('loris-integration')).toBeInTheDocument();
  });
});

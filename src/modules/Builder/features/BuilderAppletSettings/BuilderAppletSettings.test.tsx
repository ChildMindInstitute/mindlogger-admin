// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen } from '@testing-library/react';

import { renderWithAppletFormData } from 'shared/utils';
import { mockedAppletFormData, mockedAppletId } from 'shared/mock';
import { page } from 'resources';
import { getPreloadedState } from 'shared/tests/getPreloadedState';

import { BuilderAppletSettings } from './BuilderAppletSettings';

const route = `/builder/${mockedAppletId}/settings`;
const routePath = page.builderAppletSettings;

describe('BuilderAppletSettings', () => {
  test('should render settings', () => {
    renderWithAppletFormData({
      children: <BuilderAppletSettings />,
      appletFormData: mockedAppletFormData,
      options: {
        preloadedState: getPreloadedState(),
        route,
        routePath,
      },
    });

    expect(screen.getByTestId('builder-applet-settings')).toBeInTheDocument();
  });
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen } from '@testing-library/react';

import { renderWithAppletFormData } from 'shared/utils';
import { mockedApplet, mockedAppletFormData, mockedAppletId, mockedCurrentWorkspace } from 'shared/mock';
import { Roles } from 'shared/consts';
import { page } from 'resources';
import { initialStateData } from 'shared/state';

import { BuilderAppletSettings } from './BuilderAppletSettings';

const route = `/builder/${mockedAppletId}/settings`;
const routePath = page.builderAppletSettings;
const getPreloadedState = (role = Roles.Manager, isAppletExist = true) => ({
  workspaces: {
    workspaces: initialStateData,
    currentWorkspace: {
      ...initialStateData,
      ...mockedCurrentWorkspace,
    },
    roles: {
      ...initialStateData,
      data: {
        [mockedAppletId]: [role],
      },
    },
    applet: mockedApplet,
    workspacesRoles: initialStateData,
  },
  applet: {
    applet: {
      ...initialStateData,
      ...(isAppletExist ? { data: { result: mockedApplet } } : {}),
    },
  },
});

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

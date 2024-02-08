import { screen } from '@testing-library/react';

import { page } from 'resources';
import { Roles } from 'shared/consts';
import { mockedApplet, mockedAppletId, mockedCurrentWorkspace } from 'shared/mock';
import { initialStateData } from 'shared/state';
import { renderWithProviders } from 'shared/utils';

import { DashboardAppletSettings } from './DashboardAppletSettings';

const route = `/dashboard/${mockedAppletId}/settings`;
const routePath = page.appletSettings;
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

describe('DashboardAppletSettings component tests', () => {
  test('should render settings', () => {
    renderWithProviders(<DashboardAppletSettings />, {
      preloadedState: getPreloadedState(),
      route,
      routePath,
    });

    expect(screen.getByTestId('dashboard-applet-settings')).toBeInTheDocument();
  });

  test('should render no permission without applet', () => {
    renderWithProviders(<DashboardAppletSettings />, {
      preloadedState: getPreloadedState(Roles.Editor, false),
      route,
      routePath,
    });

    expect(screen.getByText('You have no permissions to view this tab.')).toBeInTheDocument();
  });

  describe('should render no permission for', () => {
    test.each`
      role                 | description
      ${Roles.Coordinator} | ${'coordinator'}
      ${Roles.Reviewer}    | ${'reviewer'}
      ${Roles.Respondent}  | ${'respondent'}
    `('$description', async ({ role }) => {
      renderWithProviders(<DashboardAppletSettings />, {
        preloadedState: getPreloadedState(role),
        route,
        routePath,
      });

      expect(screen.getByText('You have no permissions to view this tab.')).toBeInTheDocument();
    });
  });
});

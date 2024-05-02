import { screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils';
import { mockedAppletId } from 'shared/mock';
import { Roles } from 'shared/consts';
import { page } from 'resources';
import { getPreloadedState } from 'shared/tests/getPreloadedState';

import { DashboardAppletSettings } from './DashboardAppletSettings';

const route = `/dashboard/${mockedAppletId}/settings`;
const routePath = page.appletSettings;

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

    expect(
      screen.getByText('You do not have permission to view this content.'),
    ).toBeInTheDocument();
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

      expect(
        screen.getByText('You do not have permission to view this content.'),
      ).toBeInTheDocument();
    });
  });
});

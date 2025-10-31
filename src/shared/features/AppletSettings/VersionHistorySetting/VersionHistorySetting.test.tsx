// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';

import { initialStateData } from 'redux/modules';
import { page } from 'resources';
import { Roles } from 'shared/consts';
import { mockedAppletId, mockedCurrentWorkspace, mockedApplet } from 'shared/mock';
import { SettingParam } from 'shared/utils';
import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { authApiClient } from 'shared/api/apiConfig';

import { VersionHistorySetting } from './VersionHistorySetting';

const preloadedState = {
  workspaces: {
    workspaces: initialStateData,
    currentWorkspace: {
      ...initialStateData,
      ...mockedCurrentWorkspace,
    },
    roles: {
      ...initialStateData,
      data: {
        [mockedAppletId]: [Roles.Manager],
      },
    },
    applet: mockedApplet,
    workspacesRoles: initialStateData,
  },
  applet: {
    applet: {
      ...initialStateData,
      data: mockedApplet,
    },
  },
};

const versionsMock = {
  data: {
    result: [
      {
        version: '2.0.0',
        creator: {
          firstName: 'John',
          lastName: 'Doe',
        },
        createdAt: '2023-11-16T13:39:19.826478',
      },
      {
        version: '1.1.0',
        creator: {
          firstName: 'John',
          lastName: 'Doe',
        },
        createdAt: '2023-11-14T14:43:33.479910',
      },
    ],
    count: 2,
  },
};

const changesMock = {
  data: {
    result: {
      displayName: 'New applet app1 (1) added',
      changes: ['Applet Name was set to app1 (1)'],
      activities: [
        {
          name: 'Activity New Activity was added',
          changes: ['Activity Name was set to New Activity', 'Activity Order was set to 1'],
          items: [
            {
              name: 'Item itemName was added',
              changes: [
                'Item Name was set to testItemName',
                'Displayed Content was set to testDisplayedContent',
              ],
            },
          ],
        },
      ],
      activityFlows: [],
    },
  },
};

const emptyChangesMock = {
  data: {
    result: {
      displayName: 'New applet app1 (1) added',
      changes: [],
      activities: [],
      activityFlows: [],
    },
  },
};

const dataTestid = 'applet-settings-version-history';

describe('VersionHistorySetting', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authApiClient.get).mockImplementation((url) => {
      if (url.endsWith('/versions')) {
        return Promise.resolve(versionsMock);
      }
      if (url.endsWith('/2.0.0/changes')) {
        return Promise.resolve(changesMock);
      }

      return Promise.resolve(emptyChangesMock);
    });
  });

  afterEach(() => {
    cleanup();
  });

  describe('should render and change version', () => {
    test('for dashboard', async () => {
      const route = `/dashboard/${mockedAppletId}/settings/${SettingParam.VersionHistory}`;
      const routePath = page.appletSettingsItem;
      renderWithProviders(<VersionHistorySetting />, { preloadedState, route, routePath });

      expect(screen.getByTestId('spinner')).toBeVisible();
      await waitFor(() => expect(screen.getByTestId(`${dataTestid}-version`)).toBeVisible());
      // Open the select to assert the first option label reliably (MUI doesn't always render the display value text in JSDOM)
      const versionSelectRoot = screen.getByTestId(`${dataTestid}-version`);
      const selectTrigger = versionSelectRoot.querySelector('[role="button"]');
      selectTrigger && fireEvent.mouseDown(selectTrigger);
      expect(await screen.findByTestId(`${dataTestid}-version-0`)).toHaveTextContent(
        'current (2.0.0)',
      );
      expect(screen.getByTestId(`${dataTestid}-applet-changes`)).toBeVisible();
      expect(screen.getByTestId(`${dataTestid}-activities-changes`)).toBeVisible();

      const input = screen.getByTestId(`${dataTestid}-version`).querySelector('input');
      input && fireEvent.change(input, { target: { value: '1.1.0' } });

      expect(screen.getByRole('option', { name: 'version (1.1.0)' })).toHaveAttribute(
        'aria-selected',
        'true',
      );
      expect(await screen.findByText('No changes.')).toBeVisible();
    });

    test('for builder', async () => {
      const route = `/builder/${mockedAppletId}/settings/${SettingParam.VersionHistory}`;
      const routePath = page.builderAppletSettingsItem;
      renderWithProviders(<VersionHistorySetting key="builder-test" />, {
        preloadedState,
        route,
        routePath,
      });

      expect(screen.getByTestId('spinner')).toBeVisible();
      await waitFor(() => expect(screen.getByTestId(`${dataTestid}-version`)).toBeVisible());
      // Open the select to assert the first option label reliably (MUI doesn't always render the display value text in JSDOM)
      const versionSelectRoot = screen.getByTestId(`${dataTestid}-version`);
      const selectTrigger = versionSelectRoot.querySelector('[role="button"]');
      selectTrigger && fireEvent.mouseDown(selectTrigger);
      expect(await screen.findByTestId(`${dataTestid}-version-0`)).toHaveTextContent(
        'current (2.0.0)',
      );
      expect(screen.getByTestId(`${dataTestid}-applet-changes`)).toBeVisible();
      expect(screen.getByTestId(`${dataTestid}-activities-changes`)).toBeVisible();

      const input = screen.getByTestId(`${dataTestid}-version`).querySelector('input');
      input && fireEvent.change(input, { target: { value: '1.1.0' } });

      expect(screen.getByRole('option', { name: 'version (1.1.0)' })).toHaveAttribute(
        'aria-selected',
        'true',
      );
      expect(await screen.findByText('No changes.')).toBeVisible();
    });
  });
});

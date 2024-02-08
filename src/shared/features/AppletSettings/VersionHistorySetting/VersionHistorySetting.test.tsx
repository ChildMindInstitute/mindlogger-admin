// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { fireEvent, screen, waitFor } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';

import { initialStateData } from 'redux/modules';
import { page } from 'resources';
import { Roles } from 'shared/consts';
import { mockedAppletId, mockedCurrentWorkspace, mockedApplet } from 'shared/mock';
import { SettingParam, renderWithProviders } from 'shared/utils';

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
              changes: ['Item Name was set to testItemName', 'Displayed Content was set to testDisplayedContent'],
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
  describe('should render and change version', () => {
    test.each`
      route                                                                     | routePath                         | description
      ${`/dashboard/${mockedAppletId}/settings/${SettingParam.VersionHistory}`} | ${page.appletSettingsItem}        | ${'for dashboard'}
      ${`/builder/${mockedAppletId}/settings/${SettingParam.VersionHistory}`}   | ${page.builderAppletSettingsItem} | ${'for builder'}
    `('$description', async ({ route, routePath }) => {
      mockAxios.get.mockImplementation(url => {
        switch (true) {
          case url?.endsWith('/versions'):
            return Promise.resolve(versionsMock);
          case url?.endsWith('/2.0.0/changes'):
            return Promise.resolve(changesMock);
          default:
            return Promise.resolve(emptyChangesMock);
        }
      });
      renderWithProviders(<VersionHistorySetting />, { preloadedState, route, routePath });

      expect(screen.getByTestId('spinner')).toBeVisible();
      await waitFor(() => expect(screen.getByTestId(`${dataTestid}-version`)).toBeVisible());
      expect(screen.getByText('current (2.0.0)')).toBeVisible();
      expect(screen.getByTestId(`${dataTestid}-applet-changes`)).toBeVisible();
      expect(screen.getByTestId(`${dataTestid}-activities-changes`)).toBeVisible();

      const input = screen.getByTestId(`${dataTestid}-version`).querySelector('input');
      input && fireEvent.change(input, { target: { value: '1.1.0' } });

      expect(await screen.findByText('version (1.1.0)')).toBeVisible();
      expect(screen.getByText('No changes.')).toBeVisible();
    });
  });
});

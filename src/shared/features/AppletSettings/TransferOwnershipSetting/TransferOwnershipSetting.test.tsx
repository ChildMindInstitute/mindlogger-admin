import { fireEvent, screen, waitFor } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';

import { SettingParam, renderWithProviders } from 'shared/utils';
import { page } from 'resources';
import { mockedApplet, mockedAppletId, mockedCurrentWorkspace, mockedEmail } from 'shared/mock';
import { initialStateData } from 'shared/state';
import { Roles } from 'shared/consts';

import { TransferOwnershipSetting } from './TransferOwnershipSetting';

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
      data: { result: mockedApplet },
    },
  },
};

describe('TransferOwnershipSetting', () => {
  describe('should render and submit', () => {
    test.each`
      route                                                                        | routePath                         | description
      ${`/dashboard/${mockedAppletId}/settings/${SettingParam.TransferOwnership}`} | ${page.appletSettingsItem}        | ${'for dashboard'}
      ${`/builder/${mockedAppletId}/settings/${SettingParam.TransferOwnership}`}   | ${page.builderAppletSettingsItem} | ${'for builder'}
    `('$description', async ({ route, routePath }) => {
      mockAxios.post.mockResolvedValue(null);
      const dataTestid = 'applet-settings-transfer-ownership';
      renderWithProviders(<TransferOwnershipSetting />, { preloadedState, route, routePath });

      expect(screen.getByTestId(`${dataTestid}-form`)).toBeVisible();
      expect(screen.getByTestId(`${dataTestid}-confirm`)).toBeVisible();

      fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: mockedEmail } });
      fireEvent.click(screen.getByTestId(`${dataTestid}-confirm`));

      const successPopup = await screen.findByTestId(`${dataTestid}-success-popup`);
      expect(successPopup).toBeVisible();

      fireEvent.click(screen.getByText('Ok'));

      await waitFor(() => {
        expect(
          screen.queryByTestId('applet-settings-share-to-library-success-popup'),
        ).not.toBeInTheDocument();
      });
    });
  });
});

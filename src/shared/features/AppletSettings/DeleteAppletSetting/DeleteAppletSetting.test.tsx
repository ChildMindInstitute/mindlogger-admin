// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { fireEvent, screen, waitFor } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';
import userEvent from '@testing-library/user-event';

import { SettingParam, renderWithProviders } from 'shared/utils';
import { initialStateData } from 'redux/modules';
import { page } from 'resources';
import { Roles } from 'shared/consts';
import * as encryptionFunctions from 'shared/utils/encryption';
import { mockedAppletId, mockedCurrentWorkspace, mockedApplet, mockedPassword } from 'shared/mock';

import { DeleteAppletSetting } from './DeleteAppletSetting';

const route = `/dashboard/${mockedAppletId}/settings/${SettingParam.DeleteApplet}`;
const routePath = page.appletSettingsItem;
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
  popups: {
    data: {
      applet: mockedApplet,
      encryption: null,
      popupProps: undefined,
      deletePopupVisible: true,
      duplicatePopupsVisible: false,
      transferOwnershipPopupVisible: false,
      publishConcealPopupVisible: false,
    },
  },
};
const getPublicKeyMock = () => Buffer.from(JSON.parse(mockedApplet?.encryption?.publicKey || ''));

const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));

describe('DeleteAppletSetting', () => {
  test('should render and submit', async () => {
    mockAxios.delete.mockResolvedValueOnce(null);
    jest.spyOn(encryptionFunctions, 'getAppletEncryptionInfo').mockImplementation(() => ({
      getPublicKey: getPublicKeyMock,
    }));
    const { store } = renderWithProviders(<DeleteAppletSetting />, {
      preloadedState,
      route,
      routePath,
    });

    expect(screen.getByTestId('applet-settings-delete-applet-delete-button')).toBeVisible();
    expect(screen.getByTestId('applet-settings-delete-applet-delete-password-popup')).toBeVisible();

    await userEvent.type(screen.getByLabelText(/Password/), mockedPassword);

    fireEvent.click(screen.getByText('Delete'));

    await waitFor(() => {
      expect(
        store
          .getState()
          .banners.data.banners.find(
            ({ bannerProps }) =>
              bannerProps?.['data-testid'] ===
              'applet-settings-delete-applet-delete-success-banner',
          ),
      ).toBeDefined();
    });

    expect(mockedUseNavigate).toBeCalledWith('/dashboard/applets');
  });
});

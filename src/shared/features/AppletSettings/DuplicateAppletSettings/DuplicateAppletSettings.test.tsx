import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';

import { initialStateData } from 'redux/modules';
import { page } from 'resources';
import { Roles } from 'shared/consts';
import {
  mockedApplet,
  mockedAppletData,
  mockedAppletId,
  mockedCurrentWorkspace,
  mockedPassword,
} from 'shared/mock';
import { SettingParam, expectBanner } from 'shared/utils';
import { renderWithProviders } from 'shared/utils/renderWithProviders';
import * as encryptionFunctions from 'shared/utils/encryption';
import { mockGetRequestResponses } from 'shared/utils/axios-mocks';

import { DuplicateAppletSettings } from './DuplicateAppletSettings';

const route = `/dashboard/${mockedAppletId}/settings/${SettingParam.DuplicateApplet}`;
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
      data: { result: mockedApplet },
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

const mockedEncryption = {
  publicKey: '[47]',
  prime: '[145]',
  base: '[2]',
  accountId: '12345',
};

const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));

describe('DuplicateAppletSettings', () => {
  test('should render and navigate to builder', async () => {
    mockGetRequestResponses({
      [`/applets/${mockedAppletId}`]: { data: { result: mockedAppletData } },
    });
    mockAxios.post.mockResolvedValueOnce({ data: { result: { name: 'name' } } });
    mockAxios.post.mockResolvedValueOnce({ data: { result: { name: 'name' } } });
    mockAxios.post.mockResolvedValueOnce({ data: { result: mockedAppletData } });
    jest
      .spyOn(encryptionFunctions, 'getEncryptionToServer')
      .mockReturnValue(Promise.resolve(mockedEncryption));
    jest.spyOn(encryptionFunctions, 'getAppletEncryptionInfo').mockReturnValueOnce(
      Promise.resolve({
        getPrivateKey: () => [],
      }),
    );
    const dataTestid = 'applet-settings-duplicate-applet';
    const { store } = renderWithProviders(<DuplicateAppletSettings />, {
      preloadedState,
      route,
      routePath,
    });

    const duplicateButton = screen.getByTestId(`${dataTestid}-duplicate`);
    expect(duplicateButton).toBeVisible();

    fireEvent.click(duplicateButton);

    expect(await screen.findByTestId('dashboard-applets-duplicate-popup')).toBeVisible();

    fireEvent.click(screen.getByText('Submit'));
    fireEvent.change(await screen.findByLabelText('Password'), {
      target: { value: mockedPassword },
    });
    fireEvent.change(screen.getByLabelText('Repeat the password'), {
      target: { value: mockedPassword },
    });
    fireEvent.click(
      within(screen.getByTestId('dashboard-applets-duplicate-popup-password-popup')).getByText(
        'Submit',
      ),
    );
    await waitFor(() => expectBanner(store, 'SaveSuccessBanner'));

    expect(mockedUseNavigate).toBeCalledWith('/dashboard/applets');
  });

  // TODO Add test(s) for duplicating with report server configuration  - https://mindlogger.atlassian.net/browse/M2-8037
});

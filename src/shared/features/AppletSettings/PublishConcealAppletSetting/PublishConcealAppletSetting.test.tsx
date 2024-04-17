// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { fireEvent, screen } from '@testing-library/react';

import { page } from 'resources';
import {
  mockedApplet,
  mockedAppletFormData,
  mockedAppletId,
  mockedCurrentWorkspace,
} from 'shared/mock';
import { SettingParam } from 'shared/utils';
import { renderWithAppletFormData } from 'shared/utils/renderWithAppletFormData';
import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { initialStateData } from 'redux/modules';
import { Roles } from 'shared/consts';

import { PublishConcealAppletSetting } from './PublishConcealAppletSetting';

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

describe('PublishConcealAppletSetting', () => {
  test('should open publish applet popup', () => {
    const route = `/dashboard/${mockedAppletId}/settings/${SettingParam.PublishConceal}`;
    const routePath = page.appletSettingsItem;
    renderWithProviders(<PublishConcealAppletSetting isDashboard={true} />, {
      preloadedState,
      route,
      routePath,
    });

    expect(screen.getByTestId('applet-settings-publish-conceal-publish')).toBeVisible();
    expect(
      screen.getByText(
        'Once the Applet is published, it will be added to all MindLogger respondents.',
      ),
    ).toBeVisible();

    fireEvent.click(screen.getByText('Publish Applet'));

    expect(screen.getByTestId('dashboard-applets-publish-conceal-popup')).toBeVisible();
  });

  test('should open conceal applet popup', () => {
    const route = `/builder/${mockedAppletId}/settings/${SettingParam.PublishConceal}`;
    const routePath = page.builderAppletSettingsItem;
    renderWithAppletFormData({
      children: <PublishConcealAppletSetting isBuilder={true} />,
      appletFormData: { ...mockedAppletFormData, isPublished: true },
      options: { route, routePath },
    });

    expect(screen.getByTestId('applet-settings-publish-conceal-publish')).toBeVisible();
    expect(
      screen.getByText(
        'Once the Applet is concealed, it disappears for all MindLogger respondents.',
      ),
    ).toBeVisible();

    fireEvent.click(screen.getByText('Conceal Applet'));

    expect(screen.getByTestId('dashboard-applets-publish-conceal-popup')).toBeVisible();
  });
});

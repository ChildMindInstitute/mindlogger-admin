import { fireEvent, screen } from '@testing-library/react';

import { page } from 'resources';
import { mockedAppletId } from 'shared/mock';
import { SettingParam, renderWithProviders } from 'shared/utils';

import { EditAppletSetting } from './EditAppletSetting';

const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));

describe('EditAppletSetting', () => {
  describe('should render and navigate to builder', () => {
    test.each`
      route                                                                 | routePath                         | description
      ${`/dashboard/${mockedAppletId}/settings/${SettingParam.EditApplet}`} | ${page.appletSettingsItem}        | ${'for dashboard'}
      ${`/builder/${mockedAppletId}/settings/${SettingParam.EditApplet}`}   | ${page.builderAppletSettingsItem} | ${'for builder'}
    `('$description', async ({ route, routePath }) => {
      renderWithProviders(<EditAppletSetting />, { route, routePath });

      expect(screen.getByTestId('applet-settings-edit-applet-edit')).toBeVisible();

      fireEvent.click(screen.getByText('Edit Applet in Builder'));

      expect(mockedUseNavigate).toBeCalledWith(`/builder/${mockedAppletId}`);
    });
  });
});

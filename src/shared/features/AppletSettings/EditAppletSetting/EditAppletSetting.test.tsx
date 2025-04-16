import { fireEvent, screen } from '@testing-library/react';

import { page } from 'resources';
import { mockedAppletId } from 'shared/mock';
import { SettingParam } from 'shared/utils';
import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { EditAppletSetting } from './EditAppletSetting';

const route = `/dashboard/${mockedAppletId}/settings/${SettingParam.EditApplet}`;
const routePath = page.appletSettingsItem;

const mockedUseNavigate = vi.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));

describe('EditAppletSetting', () => {
  test('should render and navigate to builder', () => {
    renderWithProviders(<EditAppletSetting />, { route, routePath });

    expect(screen.getByTestId('applet-settings-edit-applet-edit')).toBeVisible();

    fireEvent.click(screen.getByText('Edit Applet in Builder'));

    expect(mockedUseNavigate).toBeCalledWith(`/builder/${mockedAppletId}`);
  });
});

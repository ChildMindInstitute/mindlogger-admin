import { fireEvent, screen } from '@testing-library/react';

import { page } from 'resources';
import { mockedAppletId } from 'shared/mock';
import { SettingParam } from 'shared/utils';
import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { EditAppletSetting } from './EditAppletSetting';

const route = `/dashboard/${mockedAppletId}/settings/${SettingParam.EditApplet}`;
const routePath = page.appletSettingsItem;

const mockedUseNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  // pull in the real implementation
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useNavigate: () => mockedUseNavigate,
  };
});

describe('EditAppletSetting', () => {
  test('should render and navigate to builder', () => {
    renderWithProviders(<EditAppletSetting />, { route, routePath });

    expect(screen.getByTestId('applet-settings-edit-applet-edit')).toBeVisible();

    fireEvent.click(screen.getByText('Edit Applet in Builder'));

    expect(mockedUseNavigate).toBeCalledWith(`/builder/${mockedAppletId}`);
  });
});

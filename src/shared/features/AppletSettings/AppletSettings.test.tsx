import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { mockedAppletId } from 'shared/mock';
import { page } from 'resources';
import { getPreloadedState } from 'shared/tests/getPreloadedState';
import { Svg } from 'shared/components';

import { AppletSettings } from './AppletSettings';

const dataTestid = 'applet-settings';

const mockOnClick = jest.fn();
const mockUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUseNavigate,
}));

const mockSettings = [
  {
    items: [
      {
        label: 'dataRetention',
        param: 'data-retention',
        disabled: false,
        tooltip: 'dataRetention',
        'data-testid': 'applet-settings-data-retention',
        component: null,
        icon: <Svg id="data-retention" />,
        onClick: mockOnClick,
      },
    ],
    label: 'usersAndData',
  },
  {
    items: [
      {
        label: 'editApplet',
        param: 'edit-applet',
        disabled: false,
        'data-testid': 'applet-settings-edit-applet',
        component: null,
        icon: <Svg id="edit-applet" />,
        onClick: mockOnClick,
      },
    ],
    label: 'appletContent',
  },
];

describe('AppletSettings component tests', () => {
  test('should render settings for dashboard', async () => {
    renderWithProviders(<AppletSettings settings={mockSettings} data-testid={dataTestid} />, {
      preloadedState: getPreloadedState(),
      route: `/dashboard/${mockedAppletId}/settings`,
      routePath: page.appletSettings,
    });

    expect(screen.getByTestId('applet-settings')).toBeInTheDocument();
    const dataRetention = screen.getByTestId('applet-settings-data-retention');
    expect(dataRetention).toBeInTheDocument();
    await userEvent.click(dataRetention);
    expect(mockUseNavigate).toHaveBeenCalledWith(
      `/dashboard/${mockedAppletId}/settings/data-retention`,
    );
    expect(mockOnClick).toHaveBeenCalled();
  });

  test('should render data retention setting', async () => {
    renderWithProviders(<AppletSettings settings={mockSettings} data-testid={dataTestid} />, {
      preloadedState: getPreloadedState(),
      route: `/dashboard/${mockedAppletId}/settings/data-retention`,
      routePath: page.appletSettingsItem,
    });

    expect(screen.getByTestId('applet-settings')).toBeInTheDocument();
    const closeButton = screen.getByTestId('close-button');
    expect(closeButton).toBeInTheDocument();
    await userEvent.click(closeButton);
    expect(mockUseNavigate).toHaveBeenCalledWith(`/dashboard/${mockedAppletId}/settings`);
  });

  test('should render settings for builder', async () => {
    renderWithProviders(
      <AppletSettings settings={mockSettings} data-testid={dataTestid} isBuilder />,
      {
        preloadedState: getPreloadedState(),
        route: `/builder/${mockedAppletId}/settings`,
        routePath: page.builderAppletSettings,
      },
    );

    expect(screen.getByTestId('applet-settings')).toBeInTheDocument();
    const dataRetention = screen.getByTestId('applet-settings-data-retention');
    expect(dataRetention).toBeInTheDocument();
    await userEvent.click(dataRetention);
    expect(mockUseNavigate).toHaveBeenCalledWith(
      `/builder/${mockedAppletId}/settings/data-retention`,
    );
    expect(mockOnClick).toHaveBeenCalled();
  });
});

import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { page } from 'resources';
import { mockedAppletId } from 'shared/mock';
import { renderWithProviders } from 'shared/utils';

import { NavigationMenu } from './NavigationMenu';
import { Svg } from '../Svg';

const mockOnClick = jest.fn();
const mockClose = jest.fn();
const mockOnSetActiveItem = jest.fn();
const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));

const dataTestid = 'dashboard-applet-settings';

const mockItems = [
  {
    items: [
      {
        label: 'exportData',
        param: 'export-data',
        disabled: false,
        isVisible: false,
        'data-testid': 'builder-applet-settings-export-data',
        component: null,
        icon: <Svg id="export" />,
        onClick: mockOnClick,
      },
      {
        label: 'dataRetention',
        param: 'data-retention',
        disabled: false,
        hasError: true,
        tooltip: 'dataRetention',
        'data-testid': 'builder-applet-settings-data-retention',
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
        disabled: true,
        'data-testid': 'builder-applet-settings-edit-applet',
        component: null,
        icon: <Svg id="edit-applet" />,
        onClick: mockOnClick,
      },
    ],
    label: 'appletContent',
  },
];

const props = {
  title: 'appletSettings',
  items: mockItems,
  onClose: mockClose,
  onSetActiveItem: mockOnSetActiveItem,
  'data-testid': dataTestid,
};

describe('NavigationMenu', () => {
  test('renders component without active item', async () => {
    renderWithProviders(<NavigationMenu {...props} />, {
      route: `/dashboard/${mockedAppletId}/settings`,
      routePath: page.appletSettings,
    });

    expect(screen.getByTestId('dashboard-applet-settings')).toBeInTheDocument();
    const leftBar = screen.getByTestId('navigation-menu-left-bar');
    expect(leftBar).toBeInTheDocument();
    expect(leftBar).toHaveTextContent('Applet Settings');

    expect(screen.queryAllByTestId(/navigation-menu-left-bar-group-\d+$/)).toHaveLength(2);

    const group0 = screen.getByTestId('navigation-menu-left-bar-group-0');
    expect(group0).toHaveTextContent('Users and Data');

    const exportData = within(group0).queryByTestId('builder-applet-settings-export-data');
    expect(exportData).not.toBeInTheDocument(); // cause has isVisible=false

    const dataRetention = within(group0).getByTestId('builder-applet-settings-data-retention');
    expect(dataRetention).toBeInTheDocument();
    expect(within(dataRetention).getByTestId('error-badge')).toBeInTheDocument();

    await userEvent.hover(dataRetention);
    expect(group0.querySelector('span[aria-label]')).toHaveAttribute(
      'aria-label',
      'Data retention',
    );

    await userEvent.click(dataRetention);
    expect(mockOnSetActiveItem).toBeCalledWith({
      component: null,
      disabled: false,
      icon: <Svg id="data-retention" />,
      label: 'dataRetention',
      onClick: mockOnClick,
      param: 'data-retention',
      tooltip: 'dataRetention',
    });

    const group1 = screen.getByTestId('navigation-menu-left-bar-group-1');
    expect(group1).toHaveTextContent('Applet Content');

    const editApplet = within(group1).getByTestId('builder-applet-settings-edit-applet');
    expect(editApplet).toBeInTheDocument();
    expect(editApplet).toHaveStyle({ pointerEvents: 'none' }); // cannot be clicked

    // no active item
    expect(screen.queryByTestId('navigation-menu-container')).not.toBeInTheDocument();
  });

  test('renders component with active item', async () => {
    renderWithProviders(<NavigationMenu {...props} />, {
      route: `/dashboard/${mockedAppletId}/settings/data-retention`,
      routePath: page.appletSettingsItem,
    });

    expect(screen.getByTestId('dashboard-applet-settings')).toBeInTheDocument();
    const leftBar = screen.getByTestId('navigation-menu-left-bar');
    expect(leftBar).toBeInTheDocument();

    // active item
    const container = screen.getByTestId('navigation-menu-container');
    expect(container).toBeInTheDocument();

    const containerHeader = within(container).getByTestId('container-header');
    expect(containerHeader).toBeInTheDocument();
    expect(containerHeader).toHaveTextContent('Data retention');

    const closeButton = within(container).getByTestId('close-button');
    expect(closeButton).toBeInTheDocument();
    await userEvent.click(closeButton);
    expect(mockClose).toBeCalled();
  });
});

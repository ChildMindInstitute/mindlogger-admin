import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { Svg } from 'shared/components/Svg';
import { page } from 'resources';

import { LinkedTabs } from './LinkedTabs';

const mockOnClick = vi.fn();
const dashboardDataTestid = 'dashboard-tab';
const mockTabs = [
  {
    labelKey: 'applets',
    id: 'dashboard-applets',
    icon: <Svg id="applet-outlined" />,
    activeIcon: <Svg id="applet-filled" />,
    path: page.dashboardApplets,
    'data-testid': `${dashboardDataTestid}-applets`,
    onClick: mockOnClick,
  },
  {
    labelKey: 'managers',
    id: 'dashboard-managers',
    icon: <Svg id="manager-outlined" />,
    activeIcon: <Svg id="manager-filled" />,
    path: page.dashboardManagers,
    hasError: true,
    'data-testid': `${dashboardDataTestid}-managers`,
    onClick: mockOnClick,
  },
  {
    labelKey: 'respondents',
    id: 'dashboard-respondents',
    icon: <Svg id="respondent-outlined" />,
    activeIcon: <Svg id="respondent-filled" />,
    'data-testid': `${dashboardDataTestid}-respondents`,
    onClick: mockOnClick,
  },
];

describe('LinkedTabs', () => {
  test('render tabs, test default active tab and tab click', async () => {
    renderWithProviders(<LinkedTabs tabs={mockTabs} />);

    mockTabs.forEach(({ 'data-testid': dataTestId, path, icon, activeIcon }, index) => {
      const linkElement = screen.getByTestId(dataTestId);
      expect(linkElement).toBeInTheDocument();
      expect(linkElement).toHaveAttribute('href', path);

      const iconElement = linkElement.querySelector('svg');
      expect(iconElement).toBeInTheDocument();

      // by default the first tab is active
      if (index === 0) {
        expect(linkElement).toHaveClass('Mui-selected');

        return expect(iconElement).toHaveClass(`svg-${activeIcon.props.id}`);
      }

      expect(linkElement).not.toHaveClass('Mui-selected');
      expect(iconElement).toHaveClass(`svg-${icon.props.id}`);
    });

    // test error
    expect(
      screen.getByTestId(`${dashboardDataTestid}-managers`).querySelector('.MuiBadge-badge'),
    ).toBeInTheDocument();

    // test click
    await userEvent.click(screen.getByTestId(`${dashboardDataTestid}-respondents`));
    expect(mockOnClick).toHaveBeenCalled();
    expect(window.location.pathname).toBe('/'); // respondents tab has no a path value
  });

  test('render tabs for a specific route', async () => {
    renderWithProviders(<LinkedTabs tabs={mockTabs} />, {
      route: '/dashboard/managers',
      routePath: page.dashboardManagers,
    });

    const managersElement = screen.getByTestId(`${dashboardDataTestid}-managers`);
    expect(managersElement).toHaveClass('Mui-selected');
    expect(managersElement.querySelector('svg')).toHaveClass('svg-manager-filled'); // active icon
  });
});

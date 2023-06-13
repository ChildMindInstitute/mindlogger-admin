import { page } from 'resources';
import { Svg } from 'shared/components';

export const links = [
  {
    icon: <Svg id="dashboard" />,
    activeIcon: <Svg id="dashboard-filled" />,
    link: page.dashboard,
    labelKey: 'dashboard',
  },
  {
    icon: <Svg id="builder" />,
    activeIcon: <Svg id="builder-filled" />,
    link: page.builder,
    labelKey: 'builder',
    disabled: true,
  },
  {
    icon: <Svg id="library" />,
    activeIcon: <Svg id="library" />,
    link: page.library,
    labelKey: 'library',
  },
];

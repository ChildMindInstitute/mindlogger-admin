import { page } from 'resources';

import { Svg } from 'components/Svg';

export const links = [
  {
    icon: <Svg id="dashboard" />,
    link: page.dashboard,
    labelKey: 'dashboard',
  },
  {
    icon: <Svg id="builder" />,
    link: page.builder,
    labelKey: 'builder',
  },
  {
    icon: <Svg id="library" />,
    link: page.library,
    labelKey: 'library',
  },
];

import { page } from 'resources';

import { Svg } from 'components/Svg';

export const links = [
  {
    icon: <Svg id="dashboard" />,
    link: page.dashboard,
    text: 'Dashboard',
  },
  {
    icon: <Svg id="builder" />,
    link: page.builder,
    text: 'Builder',
  },
  {
    icon: <Svg id="library" />,
    link: page.library,
    text: 'Library',
  },
];

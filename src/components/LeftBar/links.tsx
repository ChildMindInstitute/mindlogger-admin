import { page } from 'resources';

import { Icon } from 'components/Icon';

export const links = [
  {
    icon: <Icon.Dashboard />,
    link: page.dashboard,
    text: 'Dashboard',
  },
  {
    icon: <Icon.Builder />,
    link: page.builder,
    text: 'Builder',
  },
  {
    icon: <Icon.Library />,
    link: page.library,
    text: 'Library',
  },
];

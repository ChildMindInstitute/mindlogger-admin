import logoSrc from 'assets/images/logo.png';
import { Roles } from 'resources';

import { getRoleIcon } from './EditAccessPopup.utils';

export const applets = [
  {
    id: '1',
    title: 'Pediatric Screener',
    img: logoSrc,
    roles: [
      { icon: getRoleIcon(Roles.editor), label: Roles.editor },
      { icon: getRoleIcon(Roles.reviewer), label: Roles.reviewer },
    ],
  },
];

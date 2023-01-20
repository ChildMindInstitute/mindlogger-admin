import logoSrc from 'assets/images/logo.png';
import { Roles } from 'consts';

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
    selectedRespondents: ['001', 'respondent5'],
  },
  {
    id: '2',
    title: 'Pediatric Screener 2',
    img: logoSrc,
    roles: [{ icon: getRoleIcon(Roles.manager), label: Roles.manager }],
  },
];

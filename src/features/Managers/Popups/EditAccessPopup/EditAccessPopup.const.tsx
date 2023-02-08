import logoSrc from 'assets/images/logo.png';
import { Roles } from 'consts';

import { getRoleIcon } from './EditAccessPopup.utils';

export const mockedApplets = [
  {
    id: '1',
    title: 'Pediatric Screener',
    img: logoSrc,
    roles: [
      { icon: getRoleIcon(Roles.Editor), label: Roles.Editor },
      { icon: getRoleIcon(Roles.Reviewer), label: Roles.Reviewer },
    ],
    selectedRespondents: ['001', 'respondent5'],
  },
  {
    id: '2',
    title: 'Pediatric Screener 2',
    img: logoSrc,
    roles: [{ icon: getRoleIcon(Roles.Manager), label: Roles.Manager }],
    selectedRespondents: [],
  },
];

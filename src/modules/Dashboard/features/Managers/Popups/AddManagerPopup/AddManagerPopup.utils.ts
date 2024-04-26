import { t } from 'i18next';

import { Roles } from 'shared/consts';

export const getRoles = (roles: Roles[]) => [
  ...(roles?.includes(Roles.Coordinator)
    ? []
    : [
        {
          labelKey: t(Roles.Manager),
          value: Roles.Manager,
        },
        {
          labelKey: t(Roles.Coordinator),
          value: Roles.Coordinator,
        },
        {
          labelKey: t(Roles.Editor),
          value: Roles.Editor,
        },
      ]),
  {
    labelKey: t(Roles.Reviewer),
    value: Roles.Reviewer,
  },
];

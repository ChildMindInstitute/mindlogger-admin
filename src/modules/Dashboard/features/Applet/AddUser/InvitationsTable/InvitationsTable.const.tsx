import { t } from 'i18next';

import { HeadCell } from 'shared/types/table';

export const getHeadCells = (): HeadCell[] => [
  {
    id: 'secretUserId',
    label: t('secretUserId'),
    enableSort: true,
  },
  {
    id: 'firstName',
    label: t('firstName'),
    enableSort: true,
  },
  {
    id: 'lastName',
    label: t('lastName'),
    enableSort: true,
  },
  {
    id: 'role',
    label: t('role'),
    enableSort: true,
  },
  {
    id: 'invitationLink',
    label: t('invitationLink'),
    enableSort: true,
  },
  {
    id: 'dateTimeInvited',
    label: t('dateTimeInvited'),
    enableSort: true,
  },
];

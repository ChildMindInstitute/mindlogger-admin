import { t } from 'i18next';

import { HeadCell } from 'shared/types/table';

export const getHeadCells = (): HeadCell[] => [
  {
    id: 'secretUserId',
    label: t('secretUserId'),
    enableSort: false,
  },
  {
    id: 'firstName',
    label: t('firstName'),
    enableSort: false,
  },
  {
    id: 'lastName',
    label: t('lastName'),
    enableSort: false,
  },
  {
    id: 'role',
    label: t('role'),
    enableSort: false,
  },
  {
    id: 'email',
    label: t('email'),
    enableSort: false,
  },
  {
    id: 'invitationLink',
    label: t('invitationLink'),
    enableSort: false,
  },
  {
    id: 'dateTimeInvited',
    label: t('dateTimeInvited'),
    enableSort: false,
  },
];

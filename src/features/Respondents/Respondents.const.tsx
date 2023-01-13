import { t } from 'i18next';

import { HeadCell } from 'types/table';

export const headCells: HeadCell[] = [
  {
    id: 'pin',
    label: '',
    enableSort: true,
    width: '4.8rem',
  },
  {
    id: 'secretId',
    label: t('secretUserId'),
    enableSort: true,
  },
  {
    id: 'nickname',
    label: t('nickname'),
    enableSort: true,
  },
  {
    id: 'updated',
    label: t('updated'),
    enableSort: true,
  },
  {
    id: 'actions',
    label: t('actions'),
  },
];

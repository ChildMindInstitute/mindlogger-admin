import { t } from 'i18next';

import { HeadCell } from 'shared/types/table';

export const getHeadCells = (): HeadCell[] => [
  {
    id: 'appletName',
    label: t('appletName'),
    width: '45%',
  },
  {
    id: 'secretId',
    label: t('secretUserId'),
  },
  {
    id: 'nickname',
    label: t('nickname'),
  },
];

import { t } from 'i18next';

import { HeadCell } from 'shared/types/table';

export const getHeadCells = (): HeadCell[] => [
  {
    id: 'name',
    label: t('appletName'),
  },
  {
    id: 'actions',
    label: t('actions'),
    width: '30%',
  },
];

export const buttonTextByStep = {
  0: 'removeAccess',
  1: 'remove',
  2: 'retry',
  3: 'ok',
};

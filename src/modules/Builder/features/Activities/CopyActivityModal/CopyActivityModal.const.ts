import { t } from 'i18next';

import { HeadCell } from 'shared/types/table';

export const getHeadCells = (): HeadCell[] => [
  {
    id: 'name',
    label: t('copyActivityChooseApplet'),
    enableSort: false,
  },
  {
    id: 'actions',
    label: '',
    enableSort: false,
    width: '10%',
  },
];

import { TFunction } from 'i18next';
import { HeadCell } from 'types/table';

export const getHeadCells = (t: TFunction): HeadCell[] => [
  {
    id: 'name',
    label: t('appletName'),
    enableSort: true,
    width: '30%',
  },
  {
    id: 'updated',
    label: t('lastEdit'),
    enableSort: true,
    width: '15%',
  },
  {
    id: 'actions',
    label: t('actions'),
  },
];

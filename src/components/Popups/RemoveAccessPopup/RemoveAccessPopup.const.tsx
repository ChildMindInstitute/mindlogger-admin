import { TFunction } from 'i18next';
import { HeadCell } from 'types/table';

export const getHeadCells = (t: TFunction): HeadCell[] => [
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
  1: 'removeAccess',
  2: 'remove',
  3: 'ok',
};

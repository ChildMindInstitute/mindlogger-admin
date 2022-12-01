import { TFunction } from 'i18next';
import { HeadCell } from 'types/table';

export const getHeadCells = (t: TFunction): HeadCell[] => [
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
    id: 'email',
    label: t('email'),
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

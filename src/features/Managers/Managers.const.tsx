import { t } from 'i18next';

import { Svg } from 'components/Svg';
import { HeadCell } from 'types/table';

import { Actions } from './Managers.types';

export const getHeadCells = (): HeadCell[] => [
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

export const getActions = (
  isOwner: boolean,
  id: string | undefined,
  { removeAccessAction, editAccessAction }: Actions,
) =>
  isOwner || id
    ? []
    : [
        {
          icon: <Svg id="remove-access" />,
          action: removeAccessAction,
          tooltipTitle: t('removeAccess'),
        },
        {
          icon: <Svg id="edit-user" />,
          action: editAccessAction,
          tooltipTitle: t('removeAccess'),
        },
      ];

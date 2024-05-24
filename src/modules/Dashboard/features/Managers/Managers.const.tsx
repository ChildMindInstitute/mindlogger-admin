import i18n from 'i18n';
import { Svg } from 'shared/components/Svg';
import { HeadCell } from 'shared/types/table';

import { ManagersActions } from './Managers.types';

export enum ManagersColumnsWidth {
  Pin = '4.8rem',
  FirstName = '20rem',
  LastName = '20rem',
  Email = '30rem',
  Roles = '20rem',
}

export const getHeadCells = (id?: string): HeadCell[] => {
  const { t } = i18n;

  return [
    {
      id: 'pin',
      label: '',
      enableSort: true,
      width: ManagersColumnsWidth.Pin,
    },
    {
      id: 'firstName',
      label: t('firstName'),
      enableSort: true,
      width: ManagersColumnsWidth.FirstName,
    },
    {
      id: 'lastName',
      label: t('lastName'),
      enableSort: true,
      width: ManagersColumnsWidth.LastName,
    },
    {
      id: 'email',
      label: t('email'),
      enableSort: true,
      width: ManagersColumnsWidth.Email,
    },
    ...(id
      ? [
          {
            id: 'roles',
            label: t('roles'),
            enableSort: true,
            width: ManagersColumnsWidth.Roles,
          },
        ]
      : []),
    {
      id: 'actions',
      label: t('actions'),
    },
  ];
};

export const getActions = ({ removeAccessAction, editAccessAction }: ManagersActions) => {
  const { t } = i18n;

  return [
    {
      icon: <Svg id="remove-access" />,
      action: removeAccessAction,
      tooltipTitle: t('removeAccess'),
      'data-testid': 'dashboard-managers-remove-access',
    },
    {
      icon: <Svg id="edit-user" />,
      action: editAccessAction,
      tooltipTitle: t('editAccess'),
      'data-testid': 'dashboard-managers-edit-user',
    },
  ];
};

import i18n from 'i18n';
import { Svg } from 'shared/components/Svg';
import { HeadCell } from 'shared/types/table';
import { Manager } from 'modules/Dashboard/types';
import { variables } from 'shared/styles';

import { ManagersActions } from './Managers.types';

export enum ManagersColumnsWidth {
  Pin = '4.8rem',
  Default = '22rem',
  Email = '35rem',
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
      width: ManagersColumnsWidth.Default,
    },
    {
      id: 'lastName',
      label: t('lastName'),
      enableSort: true,
      width: ManagersColumnsWidth.Default,
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
            width: ManagersColumnsWidth.Default,
          },
        ]
      : []),
    {
      id: 'actions',
      label: t('actions'),
    },
  ];
};

export const getManagerActions = (
  { removeAccessAction, editAccessAction }: ManagersActions,
  manager: Manager,
) => {
  const { t } = i18n;

  return [
    {
      icon: <Svg id="edit-user" />,
      action: editAccessAction,
      title: t('editAccess'),
      context: manager,
      'data-testid': 'dashboard-managers-edit-user',
    },
    {
      icon: <Svg id="remove-access" />,
      action: removeAccessAction,
      title: t('removeAccess'),
      context: manager,
      customItemColor: variables.palette.dark_error_container,
      'data-testid': 'dashboard-managers-remove-access',
    },
  ];
};

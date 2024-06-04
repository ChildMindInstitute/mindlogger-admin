import i18n from 'i18n';
import { Svg } from 'shared/components/Svg';
import { HeadCell } from 'shared/types/table';
import { Manager } from 'modules/Dashboard/types';
import { variables } from 'shared/styles';

import { ManagersActions } from './Managers.types';

export const getHeadCells = (sortableColumns?: string[], appletId?: string): HeadCell[] => {
  const { t } = i18n;

  return [
    {
      id: 'avatar',
      label: '',
      width: '8rem',
    },
    {
      id: 'firstName',
      label: t('firstName'),
      enableSort: sortableColumns?.includes('firstName') ?? false,
    },
    {
      id: 'lastName',
      label: t('lastName'),
      enableSort: sortableColumns?.includes('lastName') ?? false,
    },
    {
      id: 'title',
      label: 'Title',
    },
    ...(appletId
      ? [
          {
            id: 'roles',
            label: t('role'),
            enableSort: sortableColumns?.includes('roles') ?? true,
          },
        ]
      : []),
    {
      id: 'email',
      label: t('email'),
      enableSort: sortableColumns?.includes('email') ?? false,
    },
    {
      id: 'actions',
      label: '',
      width: '8rem',
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

import { Checkbox } from '@mui/material';

import i18n from 'i18n';
import { Svg } from 'shared/components/Svg';
import { HeadCell } from 'shared/types/table';
import { Manager } from 'modules/Dashboard/types';
import { variables } from 'shared/styles';

import { ManagersActions } from './Managers.types';

export const getHeadCells = (id?: string): HeadCell[] => {
  const { t } = i18n;

  return [
    {
      id: 'checkbox',
      label: <Checkbox aria-label={t('checkAll')} checked={false} />,
      width: '8rem',
    },
    {
      id: 'avatar',
      label: '',
      width: '8rem',
    },
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
      id: 'title',
      label: 'Title',
    },
    ...(id
      ? [
          {
            id: 'role',
            label: t('role'),
            enableSort: true,
          },
        ]
      : []),
    {
      id: 'email',
      label: t('email'),
      enableSort: true,
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

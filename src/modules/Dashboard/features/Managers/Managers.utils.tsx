import { format } from 'date-fns';

import i18n from 'i18n';
import { Svg } from 'shared/components/Svg';
import { HeadCell } from 'shared/types/table';
import { Manager } from 'modules/Dashboard/types';
import { variables } from 'shared/styles';
import { MenuItem, MenuItemType } from 'shared/components';
import { DateFormats } from 'shared/consts';

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
  actions: ManagersActions,
  manager: Manager,
): MenuItem<Manager>[] => {
  const { t } = i18n;

  const menuItems: MenuItem<Manager>[] = [];

  if (manager.status === 'pending') {
    menuItems.push(
      {
        type: MenuItemType.Info,
        title: `${t('invitationDate')}: ${format(
          new Date(manager.createdAt),
          `${DateFormats.MonthDayYear} '${t('lowercaseAt')}' ${DateFormats.Time}`,
        )}`,
      },
      { type: MenuItemType.Divider },
      {
        icon: <Svg id="duplicate" width={24} height={24} />,
        action: actions.copyEmailAddressAction,
        title: t('copyEmailAddress'),
        context: manager,
      },
      { type: MenuItemType.Divider },
      {
        icon: <Svg id="format-link" width={24} height={24} />,
        action: actions.copyInvitationLinkAction,
        title: t('copyInvitationLink'),
        context: manager,
      },
      { type: MenuItemType.Divider },
    );
  }

  menuItems.push(
    {
      icon: <Svg id="edit-user" />,
      action: actions.editAccessAction,
      title: t('editAccess'),
      context: manager,
      'data-testid': 'dashboard-managers-edit-user',
    },
    {
      icon: <Svg id="remove-access" />,
      action: actions.removeAccessAction,
      title: t('removeAccess'),
      context: manager,
      customItemColor: variables.palette.dark_error_container,
      'data-testid': 'dashboard-managers-remove-access',
    },
  );

  return menuItems;
};

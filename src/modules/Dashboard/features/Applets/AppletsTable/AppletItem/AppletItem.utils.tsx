import { t } from 'i18next';

import { Svg } from 'shared/components/Svg';
import { Roles } from 'shared/consts';
import { isManagerOrOwner } from 'shared/utils';

import { AppletActions } from './AppletItem.types';

export const getAppletActions = ({
  actions: {
    removeFromFolder,
    viewUsers,
    viewCalendar,
    deleteAction,
    transferOwnership,
    duplicateAction,
    // shareAppletAction,
    publishAppletAction,
    editAction,
  },
  item,
  roles,
}: AppletActions) => {
  const { isPublished } = item;
  const isReviewer = roles?.includes(Roles.Reviewer);
  const isEditor = roles?.includes(Roles.Editor);
  const isOwner = roles?.includes(Roles.Owner);
  const isCoordinator = roles?.includes(Roles.Coordinator);
  const isSuperAdmin = roles?.includes(Roles.SuperAdmin);
  const commonCondition = isManagerOrOwner(roles?.[0]) || isEditor || isSuperAdmin;

  return [
    {
      icon: <Svg id="remove-from-folder" />,
      action: removeFromFolder,
      title: t('removeFromFolder'),
      isDisplayed: !!item.parentId,
      'data-testid': 'dashboard-applets-applet-remove-from-folder',
    },
    {
      icon: <Svg id="users" />,
      action: viewUsers,
      title: t('viewUsers'),
      isDisplayed: isManagerOrOwner(roles?.[0]) || isReviewer || isCoordinator || isSuperAdmin,
      'data-testid': 'dashboard-applets-applet-view-users',
    },
    {
      icon: <Svg id="calendar" />,
      action: viewCalendar,
      title: t('viewGeneralCalendar'),
      isDisplayed: isManagerOrOwner(roles?.[0]) || isCoordinator || isSuperAdmin,
      'data-testid': 'dashboard-applets-applet-view-calendar',
    },
    {
      icon: <Svg id="widget" />,
      action: editAction,
      title: t('editAnApplet'),
      isDisplayed: commonCondition,
      'data-testid': 'dashboard-applets-applet-edit',
    },
    {
      icon: <Svg id="duplicate" />,
      action: duplicateAction,
      title: t('duplicateApplet'),
      isDisplayed: commonCondition,
      'data-testid': 'dashboard-applets-applet-duplicate',
    },
    {
      icon: <Svg id="trash" />,
      action: deleteAction,
      title: t('deleteApplet'),
      isDisplayed: commonCondition,
      'data-testid': 'dashboard-applets-applet-delete',
    },
    {
      icon: <Svg id="switch-account" />,
      action: transferOwnership,
      title: t('transferOwnership'),
      isDisplayed: isOwner || isSuperAdmin,
      'data-testid': 'dashboard-applets-applet-transfer',
    },
    // Share to Library functionality shall be hidden on UI until the Moderation process within MindLogger is
    // introduced. (Story: AUS-4.1.4.10).
    // {
    //   icon: <Svg id="share" />,
    //   action: shareAppletAction,
    //   title: t('shareWithTheLibrary'),
    //   'data-testid': 'dashboard-applets-applet-share',
    // },
    {
      icon: <Svg id={isPublished ? 'conceal' : 'publish'} width="18" height="18" />,
      action: publishAppletAction,
      title: t(isPublished ? 'conceal' : 'publish'),
      isDisplayed: !item.isFolder && isSuperAdmin,
      'data-testid': 'dashboard-applets-applet-publish-conceal',
    },
  ];
};

export const hasOwnerRole = (role?: Roles) => role === Roles.Owner;

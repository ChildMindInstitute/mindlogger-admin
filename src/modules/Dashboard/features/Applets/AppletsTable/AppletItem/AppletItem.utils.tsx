import { t } from 'i18next';

import { Svg } from 'shared/components/Svg';
import { Roles } from 'shared/consts';
import { isManagerOrOwner } from 'shared/utils';

import { Actions } from './AppletItem.types';

export const getActions = ({
  actions: {
    removeFromFolder,
    viewUsers,
    viewCalendar,
    deleteAction,
    transferOwnership,
    duplicateAction,
    shareAppletAction,
    publishAppletAction,
    editAction,
  },
  item,
  roles,
}: Actions) => {
  const { isPublished } = item;
  const isReviewer = roles?.includes(Roles.Reviewer);
  const isEditor = roles?.includes(Roles.Editor);
  const isOwner = roles?.includes(Roles.Owner);
  const isCoordinator = roles?.includes(Roles.Coordinator);
  const isSuperAdmin = roles?.includes(Roles.SuperAdmin);
  const commonCondition = isManagerOrOwner(roles?.[0]) || isEditor;

  return [
    {
      icon: <Svg id="remove-from-folder" />,
      action: removeFromFolder,
      tooltipTitle: t('removeFromFolder'),
      isDisplayed: !!item.parentId,
      'data-testid': 'dashboard-applets-applet-remove-from-folder',
    },
    {
      icon: <Svg id="users" />,
      action: viewUsers,
      tooltipTitle: t('viewUsers'),
      isDisplayed: isManagerOrOwner(roles?.[0]) || isReviewer || isCoordinator,
      'data-testid': 'dashboard-applets-applet-view-users',
    },
    {
      icon: <Svg id="calendar" />,
      action: viewCalendar,
      tooltipTitle: t('viewGeneralCalendar'),
      isDisplayed: isManagerOrOwner(roles?.[0]) || isCoordinator,
      'data-testid': 'dashboard-applets-applet-view-calendar',
    },
    {
      icon: <Svg id="widget" />,
      action: editAction,
      tooltipTitle: t('editAnApplet'),
      isDisplayed: commonCondition,
      'data-testid': 'dashboard-applets-applet-edit',
    },
    {
      icon: <Svg id="duplicate" />,
      action: duplicateAction,
      tooltipTitle: t('duplicateApplet'),
      isDisplayed: commonCondition,
      'data-testid': 'dashboard-applets-applet-duplicate',
    },
    {
      icon: <Svg id="trash" />,
      action: deleteAction,
      tooltipTitle: t('deleteApplet'),
      isDisplayed: commonCondition,
      'data-testid': 'dashboard-applets-applet-delete',
    },
    {
      icon: <Svg id="switch-account" />,
      action: transferOwnership,
      tooltipTitle: t('transferOwnership'),
      isDisplayed: isOwner,
      'data-testid': 'dashboard-applets-applet-transfer',
    },
    // Share to Library functionality shall be hidden on UI until the Moderation process within MindLogger is
    // introduced. (Story: AUS-4.1.4.10). Comment after QA check.
    {
      icon: <Svg id="share" />,
      action: shareAppletAction,
      tooltipTitle: t('shareWithTheLibrary'),
      'data-testid': 'dashboard-applets-applet-share',
    },
    {
      icon: <Svg id={isPublished ? 'conceal' : 'publish'} width="18" height="18" />,
      action: publishAppletAction,
      tooltipTitle: t(isPublished ? 'conceal' : 'publish'),
      isDisplayed: !item.isFolder && isSuperAdmin,
      'data-testid': 'dashboard-applets-applet-publish-conceal',
    },
  ];
};

export const hasOwnerRole = (role?: Roles) => role === Roles.Owner;

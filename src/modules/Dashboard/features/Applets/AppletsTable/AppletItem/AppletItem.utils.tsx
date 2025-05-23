import { t } from 'i18next';

import { Svg } from 'shared/components/Svg';
import { Roles } from 'shared/consts';
import { variables } from 'shared/styles';
import { checkIfCanEdit, isManagerOrOwner } from 'shared/utils';

import { AppletActions } from './AppletItem.types';

export const getAppletActions = ({
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
  enableShareToLibrary,
}: AppletActions) => {
  const { isPublished } = item;
  const isReviewer = roles?.includes(Roles.Reviewer);
  const isOwner = roles?.includes(Roles.Owner);
  const isCoordinator = roles?.includes(Roles.Coordinator);
  const isSuperAdmin = roles?.includes(Roles.SuperAdmin);
  const canEdit = checkIfCanEdit(roles);

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
      title: t('editApplet'),
      isDisplayed: canEdit,
      'data-testid': 'dashboard-applets-applet-edit',
    },
    {
      icon: <Svg id="duplicate" />,
      action: duplicateAction,
      title: t('duplicateApplet'),
      isDisplayed: canEdit,
      'data-testid': 'dashboard-applets-applet-duplicate',
    },
    {
      icon: <Svg id="switch-account" />,
      action: transferOwnership,
      title: t('transferOwnership'),
      isDisplayed: isOwner || isSuperAdmin,
      'data-testid': 'dashboard-applets-applet-transfer',
    },
    /*The "Share to Library" functionality is hidden in the UI under the feature flag "enableShareToLibrary"
    with workspaces ID limitations until the Moderation process within Curious is introduced. (Story:
    AUS-4.1.4.10).*/
    {
      icon: <Svg id="share" />,
      action: shareAppletAction,
      title: t('shareWithTheLibrary'),
      isDisplayed: canEdit && enableShareToLibrary,
      'data-testid': 'dashboard-applets-applet-share',
    },
    {
      icon: <Svg id={isPublished ? 'conceal' : 'publish'} width="18" height="18" />,
      action: publishAppletAction,
      title: t(isPublished ? 'conceal' : 'publish'),
      isDisplayed: !item.isFolder && isSuperAdmin,
      'data-testid': 'dashboard-applets-applet-publish-conceal',
    },
    {
      icon: <Svg id="trash" />,
      action: deleteAction,
      title: t('deleteApplet'),
      isDisplayed: canEdit,
      customItemColor: variables.palette.dark_error_container,
      'data-testid': 'dashboard-applets-applet-delete',
    },
  ];
};

export const hasOwnerRole = (role?: Roles) => role === Roles.Owner;

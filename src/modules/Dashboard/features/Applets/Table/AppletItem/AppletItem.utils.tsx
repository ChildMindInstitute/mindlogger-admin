import { t } from 'i18next';

import { Svg } from 'shared/components';
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
    // shareAppletAction,
    publishAppletAction,
    editAction,
  },
  item,
  roles,
}: Actions) => {
  const { isPublished } = item;
  const isRespondent = roles?.includes(Roles.Respondent);
  const isReviewer = roles?.includes(Roles.Reviewer);
  const isEditor = roles?.includes(Roles.Editor);
  const isOwner = roles?.includes(Roles.Owner);
  const isSuperAdmin = roles?.includes(Roles.SuperAdmin);
  const commonCondition = isManagerOrOwner(roles?.[0]) || isEditor;

  return [
    {
      isDisplayed: !!item.parentId,
      icon: <Svg id="remove-from-folder" />,
      action: removeFromFolder,
      tooltipTitle: t('removeFromFolder'),
    },
    {
      icon: <Svg id="users" />,
      action: viewUsers,
      tooltipTitle: t('viewUsers'),
      isDisplayed: !isEditor,
    },
    {
      icon: <Svg id="calendar" />,
      action: viewCalendar,
      tooltipTitle: t('viewGeneralCalendar'),
      isDisplayed: !isRespondent && !isReviewer,
    },
    {
      icon: <Svg id="widget" />,
      action: editAction,
      tooltipTitle: t('editAnApplet'),
      isDisplayed: commonCondition,
    },
    {
      icon: <Svg id="duplicate" />,
      action: duplicateAction,
      tooltipTitle: t('duplicateApplet'),
      isDisplayed: commonCondition,
    },
    {
      icon: <Svg id="trash" />,
      action: deleteAction,
      tooltipTitle: t('deleteApplet'),
      isDisplayed: isManagerOrOwner(roles?.[0]),
    },
    {
      icon: <Svg id="switch-account" />,
      action: transferOwnership,
      tooltipTitle: t('transferOwnership'),
      isDisplayed: isOwner,
    },
    // Share to Library functionality shall be hidden on UI until the Moderation process within MindLogger is
    // introduced. (Story: AUS-4.1.4.10)
    // {
    //   icon: <Svg id="share" />,
    //   action: shareAppletAction,
    //   tooltipTitle: t('shareWithTheLibrary'),
    // },
    {
      isDisplayed: !item.isFolder && isSuperAdmin,
      icon: <Svg id={isPublished ? 'conceal' : 'publish'} width="18" height="18" />,
      action: publishAppletAction,
      tooltipTitle: t(isPublished ? 'conceal' : 'publish'),
    },
  ];
};

export const hasOwnerRole = (item: unknown & { role?: string }) =>
  !!item.role?.includes(Roles.Owner);

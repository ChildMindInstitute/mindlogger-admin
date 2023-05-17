import { t } from 'i18next';

import { Svg } from 'shared/components';
import { Roles } from 'shared/consts';

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
    editAction,
  },
  item,
}: Actions) => {
  const { role } = item;
  const commonCondition =
    role !== Roles.Coordinator && role !== Roles.Respondent && role !== Roles.Reviewer;

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
      isDisplayed: role !== Roles.Editor,
    },
    {
      icon: <Svg id="calendar" />,
      action: viewCalendar,
      tooltipTitle: t('viewGeneralCalendar'),
      isDisplayed: commonCondition,
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
      isDisplayed: role === Roles.Owner || item.role === Roles.Manager,
    },
    {
      icon: <Svg id="switch-account" />,
      action: transferOwnership,
      tooltipTitle: t('transferOwnership'),
      isDisplayed: role === Roles.Owner,
    },
    // Share to Library functionality shall be hidden on UI until the Moderation process within MindLogger is
    // introduced. (Story: AUS-4.1.4.10)
    // {
    //   icon: <Svg id="share" />,
    //   action: shareAppletAction,
    //   tooltipTitle: t('shareWithTheLibrary'),
    // },
  ];
};

export const hasOwnerRole = (item: unknown & { role?: string }) =>
  !!item.role?.includes(Roles.Owner);

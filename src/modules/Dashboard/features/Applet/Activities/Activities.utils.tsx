import { t } from 'i18next';

import { Svg } from 'shared/components/Svg';
import { MenuItem, MenuItemType } from 'shared/components';
import { isManagerOrOwner } from 'shared/utils';
import { Roles } from 'shared/consts';

import { ActivityActions, ActivityActionProps } from './Activities.types';

export const getActivityActions = ({
  actions: { editActivity, exportData, assignActivity, takeNow },
  appletId,
  activityId,
  dataTestid,
  roles,
}: ActivityActions): MenuItem<ActivityActionProps>[] => {
  const canEdit =
    isManagerOrOwner(roles?.[0]) ||
    roles?.includes(Roles.Editor) ||
    roles?.includes(Roles.SuperAdmin);

  return [
    {
      icon: <Svg id="edit" />,
      action: editActivity,
      title: t('editActivity'),
      context: { appletId, activityId },
      isDisplayed: canEdit,
      'data-testid': `${dataTestid}-activity-edit`,
    },
    {
      icon: <Svg id="export" />,
      action: exportData,
      title: t('exportData'),
      context: { appletId, activityId },
      isDisplayed: true,
      'data-testid': `${dataTestid}-activity-export`,
    },
    { type: MenuItemType.Divider },
    {
      icon: <Svg id="add" />,
      action: assignActivity,
      title: t('assignActivity'),
      context: { appletId, activityId },
      isDisplayed: true,
      'data-testid': `${dataTestid}-activity-assign`,
    },
    {
      icon: <Svg id="play-outline" />,
      action: takeNow,
      title: t('takeNow'),
      context: { appletId, activityId },
      isDisplayed: true,
      'data-testid': `${dataTestid}-activity-take-now`,
    },
  ];
};

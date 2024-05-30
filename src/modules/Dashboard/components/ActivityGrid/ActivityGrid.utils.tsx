import { t } from 'i18next';

import { Svg } from 'shared/components/Svg';
import { MenuItem, MenuItemType } from 'shared/components';
import {
  checkIfCanAccessData,
  checkIfCanEdit,
  checkIfCanManageParticipants,
  checkIfCanTakeNow,
} from 'shared/utils';

import { ActivityActions, ActivityActionProps } from './ActivityGrid.types';

export const getActivityActions = ({
  actions: { editActivity, exportData, assignActivity, takeNow },
  appletId,
  activityId,
  dataTestId,
  roles,
  featureFlags,
  hasParticipants,
}: ActivityActions): MenuItem<ActivityActionProps>[] => {
  const canEdit = checkIfCanEdit(roles);
  const canAccessData = checkIfCanAccessData(roles);
  const canDoTakeNow =
    featureFlags.enableMultiInformantTakeNow && hasParticipants && checkIfCanTakeNow(roles);
  const canAssignActivity =
    checkIfCanManageParticipants(roles) && featureFlags.enableActivityAssign;
  const showDivider = (canEdit || canAccessData) && (canDoTakeNow || canAssignActivity);

  return [
    {
      icon: <Svg id="edit" />,
      action: editActivity,
      title: t('editActivity'),
      context: { appletId, activityId },
      isDisplayed: canEdit,
      'data-testid': `${dataTestId}-activity-edit`,
    },
    {
      icon: <Svg id="export" />,
      action: exportData,
      title: t('exportData'),
      context: { appletId, activityId },
      isDisplayed: canAccessData,
      'data-testid': `${dataTestId}-activity-export`,
    },
    { type: MenuItemType.Divider, isDisplayed: showDivider },
    {
      icon: <Svg id="add" />,
      action: assignActivity,
      title: t('assignActivity'),
      context: { appletId, activityId },
      isDisplayed: canAssignActivity,
      'data-testid': `${dataTestId}-activity-assign`,
    },
    {
      icon: <Svg id="play-outline" />,
      action: takeNow,
      title: t('takeNow.menuItem'),
      context: { appletId, activityId },
      isDisplayed: canDoTakeNow,
      'data-testid': `${dataTestId}-activity-take-now`,
    },
  ];
};

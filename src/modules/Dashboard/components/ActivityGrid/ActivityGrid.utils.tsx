import { t } from 'i18next';

import { Svg } from 'shared/components/Svg';
import { MenuItem, MenuItemType } from 'shared/components';
import {
  checkIfCanAccessData,
  checkIfCanEdit,
  checkIfCanManageParticipants,
  checkIfFullAccess,
  getIsWebSupported,
} from 'shared/utils';
import { EditablePerformanceTasks } from 'modules/Builder/features/Activities/Activities.const';

import { ActivityActions, ActivityActionProps } from './ActivityGrid.types';

export const getActivityActions = ({
  actions: { editActivity, exportData, assignActivity, takeNow },
  appletId,
  dataTestId,
  roles,
  featureFlags,
  hasParticipants,
  activity,
}: ActivityActions): MenuItem<ActivityActionProps>[] => {
  const canEdit =
    (checkIfCanEdit(roles) && !activity?.isPerformanceTask) ||
    EditablePerformanceTasks.includes(activity?.performanceTaskType ?? '');
  const canAccessData = checkIfCanAccessData(roles);
  const canDoTakeNow = hasParticipants && checkIfFullAccess(roles);
  const canAssignActivity =
    checkIfCanManageParticipants(roles) && featureFlags.enableActivityAssign;
  const showDivider = (canEdit || canAccessData) && (canDoTakeNow || canAssignActivity);
  const { id: activityId } = activity;
  const isWebUnsupported = !getIsWebSupported(activity.items);

  if (!activityId) return [];

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
      disabled: isWebUnsupported,
      tooltip: isWebUnsupported && t('activityIsMobileOnly'),
      'data-testid': `${dataTestId}-activity-take-now`,
    },
  ];
};

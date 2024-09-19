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
  actions: { editActivity, exportData, assignActivity, unassignActivity, takeNow },
  appletId,
  subjectId,
  dataTestId,
  roles,
  featureFlags,
  hasParticipants,
  activity,
}: ActivityActions): MenuItem<ActivityActionProps>[] => {
  const { id: activityId, autoAssign } = activity;
  const canEdit =
    (checkIfCanEdit(roles) && !activity?.isPerformanceTask) ||
    EditablePerformanceTasks.includes(activity?.performanceTaskType ?? '');
  const canAccessData = checkIfCanAccessData(roles);
  const canDoTakeNow = hasParticipants && checkIfFullAccess(roles);
  const canAssign = checkIfCanManageParticipants(roles) && featureFlags.enableActivityAssign;
  const isAssigned = !!activity.assignments?.some(
    (a) => subjectId && (a.respondentSubject.id === subjectId || a.targetSubject.id === subjectId),
  );
  const showDivider = (canEdit || canAccessData || canAssign) && canDoTakeNow;
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
    {
      icon: <Svg id="file-plus" />,
      action: assignActivity,
      title: t('assignActivity'),
      context: { appletId, activityId },
      isDisplayed: canAssign && !autoAssign,
      'data-testid': `${dataTestId}-activity-assign`,
    },
    {
      icon: <Svg id="clear-calendar" />,
      action: unassignActivity,
      title: t('unassignActivity'),
      context: { appletId, activityId },
      isDisplayed: canAssign && (autoAssign || isAssigned),
      disabled: autoAssign,
      tooltip: autoAssign && t('unassignActivityDisabledTooltip'),
      'data-testid': `${dataTestId}-activity-unassign`,
    },
    { type: MenuItemType.Divider, isDisplayed: showDivider },
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

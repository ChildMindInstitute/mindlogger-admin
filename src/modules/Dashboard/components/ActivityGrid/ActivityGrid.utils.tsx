import { t } from 'i18next';
import {
  isWithinInterval,
  getDay,
  getYear,
  getMonth,
  getHours,
  getMinutes,
  getSeconds,
} from 'date-fns';

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
import { PeriodicityType } from 'shared/state/Applet/Applet.schema';

import { ActivityActions, ActivityActionProps } from './ActivityGrid.types';

function datetimeIsWithinInterval(start: Date, end: Date) {
  const today = new Date();

  return isWithinInterval(today, { start, end });
}

function getDividedDateValues(date: Date) {
  return {
    day: getDay(date),
    month: getMonth(date) + 1,
    year: getYear(date),
    hour: getHours(date),
    minute: getMinutes(date),
    second: getSeconds(date),
    date,
  };
}

/**
 * this function validates if the date is in range based on the PeriodicityTypes object
 * @param periodicity
 * @returns boolean
 */
function validateIfDateIsInRange(periodicity: PeriodicityType) {
  const currentDate = new Date();
  const startDate = new Date(`${periodicity.start_date}T${periodicity.start_time}`);
  const endDate = new Date(`${periodicity.end_date}T${periodicity.end_time}`);

  const currentTimeValues = getDividedDateValues(currentDate);
  const startTimeValues = getDividedDateValues(startDate);
  const endTimeValues = getDividedDateValues(endDate);

  // if ((periodicity?.type as string)?.toLowerCase === PeriodicityTypes.ALWAYS.toLowerCase) {
  // }
  return {
    endTimeValues,
    startTimeValues,
    currentTimeValues,
  };
}

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
  const canDoTakeNow =
    featureFlags.enableMultiInformantTakeNow && hasParticipants && checkIfFullAccess(roles);
  const canAssignActivity =
    checkIfCanManageParticipants(roles) && featureFlags.enableActivityAssign;
  const showDivider = (canEdit || canAccessData) && (canDoTakeNow || canAssignActivity);
  const { id: activityId } = activity;
  const isWebUnsupported = !getIsWebSupported(activity.items);

  if (!activityId || !activity?.periodicity) return [];

  const bb = validateIfDateIsInRange(activity?.periodicity);

  datetimeIsWithinInterval(bb.startTimeValues.date, bb.endTimeValues.date);

  // console.log('activity.periodicity', activity.periodicity);
  // console.log('bb', bb);

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

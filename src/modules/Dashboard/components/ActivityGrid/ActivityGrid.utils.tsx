import { t } from 'i18next';
import {
  isWithinInterval,
  getDay,
  getDate,
  getYear,
  getMonth,
  getHours,
  getMinutes,
  getSeconds,
  format,
  isWeekend,
  isAfter,
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

/**
 * this function checks if the current date is within the interval passed as arguments
 * @param start Date
 * @param end Date
 * @returns boolean
 */
function datetimeIsWithinInterval(start: Date, end: Date) {
  const today = new Date();
  if (isAfter(start, end)) {
    console.error('The start date is after the end date, be sure to check the dates');

    // using the isWithinInterval function with the start and end dates swapped
    // in case the start date is after the end date
    return isWithinInterval(today, { start: end, end: start });
  }

  return isWithinInterval(today, { start, end });
}

/**
 * this function returns the values of the date represented as an object
 * @param date Date
 * @returns object
 */
function getDateValues(date: Date) {
  if (!date || !(date instanceof Date)) {
    console.error('The date is not valid, be sure to pass a valid date');

    return {
      day: 0,
      month: 0,
      year: 0,
      hour: 0,
      minute: 0,
      second: 0,
      dayInWeek: 0,
      date: new Date(),
    };
  }

  return {
    day: getDate(date),
    month: getMonth(date) + 1,
    year: getYear(date),
    hour: getHours(date),
    minute: getMinutes(date),
    second: getSeconds(date),
    dayInWeek: getDay(date),
    date,
  };
}

const PERIODICITY_VALUES = {
  ONCE: 'ONCE',
  ALWAYS: 'ALWAYS',
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY',
  WEEKDAYS: 'WEEKDAYS',
  MONTHLY: 'MONTHLY',
};

/**
 * this function formats the date as YYYY-MM-DD
 * @param date Date
 * @returns string
 */
function formatDateAsYYYYMMDD(date: Date) {
  if (!date || !(date instanceof Date)) {
    console.error('The date is not valid, be sure to pass a valid date');
  }

  return format(date, 'yyyy-MM-dd');
}

/**
 * this function validates if the date is in range based on the PeriodicityTypes object
 * the options of validation are:
 * - if the periodicity is always, which means that the activity is always available
 * - if the periodicity is once, which means that the activity is available only once
 * - if the periodicity is daily, which means that the activity is available every day
 * - if the periodicity is weekly, which means that the activity is available every week at the same week day
 * - if the periodicity is weekdays, which means that the activity is available every weekday and not in weekends
 * - if the periodicity is monthly, which means that the activity is available every month at the same day
 * - if the periodicity is not set
 * @param periodicity PeriodicityType
 * @returns boolean
 */
function validateIfDateIsInRange(periodicity: PeriodicityType) {
  if (!periodicity) {
    console.error('The periodicity is not set, be sure to pass a valid periodicity');

    return false;
  }

  if (periodicity.access_before_schedule) {
    return true;
  }

  const currentDate = new Date();
  const currentTimeValues = getDateValues(currentDate);
  const startDate = new Date(
    `${periodicity.start_date ? periodicity.start_date : formatDateAsYYYYMMDD(currentDate)}T${
      periodicity.start_time
    }`,
  );
  const endDate = new Date(
    `${periodicity?.end_date ? periodicity.start_date : formatDateAsYYYYMMDD(currentDate)}T${
      periodicity.end_time
    }`,
  );

  const startTimeValues = getDateValues(startDate);

  if (
    periodicity.type === PERIODICITY_VALUES.ALWAYS ||
    periodicity.type === PERIODICITY_VALUES.ONCE ||
    periodicity.type === PERIODICITY_VALUES.DAILY
  ) {
    return datetimeIsWithinInterval(startDate, endDate);
  } else if (periodicity.type === PERIODICITY_VALUES.WEEKLY) {
    if (currentTimeValues.dayInWeek !== startTimeValues.dayInWeek) {
      return false;
    }

    return datetimeIsWithinInterval(startDate, endDate);
  } else if (periodicity.type === PERIODICITY_VALUES.WEEKDAYS) {
    if (isWeekend(currentDate)) {
      return false;
    }

    return datetimeIsWithinInterval(startDate, endDate);
  } else if (
    periodicity.type === PERIODICITY_VALUES.MONTHLY &&
    currentTimeValues.day === startTimeValues.day
  ) {
    return datetimeIsWithinInterval(startDate, endDate);
  }

  return false;
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

  // eslint-disable-next-line unused-imports/no-unused-vars
  const isAValidDateRange = validateIfDateIsInRange(activity?.periodicity);
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

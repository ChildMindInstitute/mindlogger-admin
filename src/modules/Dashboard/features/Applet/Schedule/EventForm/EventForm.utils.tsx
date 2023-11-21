import { UseFormGetValues } from 'react-hook-form';
import {
  addDays,
  differenceInDays,
  eachDayOfInterval,
  endOfYear,
  format,
  getDate,
  getDay,
} from 'date-fns';
import * as yup from 'yup';

import i18n from 'i18n';
import { DateFormats } from 'shared/consts';
import { Svg } from 'shared/components/Svg';
import { Activity, ActivityFlow } from 'shared/state';
import {
  CreateEventType,
  EventNotifications,
  NotificationType,
  Periodicity,
  TimerType,
} from 'modules/Dashboard/api';
import { CalendarEvent } from 'modules/Dashboard/state';
import { getIsRequiredValidateMessage } from 'shared/utils';
import { getDaysInMonthlyPeriodicity } from 'modules/Dashboard/state/CalendarEvents/CalendarEvents.utils';

import { convertDateToYearMonthDay, removeSecondsFromTime } from '../Schedule.utils';
import { AvailabilityTab } from './AvailabilityTab';
import { NotificationsTab } from './NotificationsTab';
import { TimersTab } from './TimersTab';
import {
  DEFAULT_END_TIME,
  DEFAULT_IDLE_TIME,
  DEFAULT_START_TIME,
  DEFAULT_TIMER_DURATION,
  ONCE_ACTIVITY_INCOMPLETE_LIMITATION,
  SECONDS_TO_MILLISECONDS_MULTIPLIER,
} from './EventForm.const';
import {
  EventFormValues,
  FormReminder,
  GetBetweenStartEndNextDayComparisonProps,
  GetBetweenStartEndNextDaySingleComparisonProps,
  GetDaysInPeriod,
  GetEventFromTabs,
  GetNotificationTimeComparisonProps,
  GetNotificationsValidationProps,
  GetWeeklyDays,
  NotificationTimeTestContext,
  SecondsManipulation,
} from './EventForm.types';

const { t } = i18n;

export const getEventFormTabs = ({
  hasAvailabilityErrors,
  hasTimerErrors,
  hasNotificationsErrors,
  hasAlwaysAvailableOption,
  'data-testid': dataTestid,
}: GetEventFromTabs) => [
  {
    labelKey: 'availability',
    id: 'event-form-availability',
    content: (
      <AvailabilityTab
        hasAlwaysAvailableOption={hasAlwaysAvailableOption}
        data-testid={`${dataTestid}-availability`}
      />
    ),
    hasError: hasAvailabilityErrors,
    'data-testid': `${dataTestid}-availability-tab`,
  },
  {
    labelKey: 'timers',
    id: 'event-form-timers',
    content: <TimersTab data-testid={`${dataTestid}-availability`} />,
    hasError: hasTimerErrors,
    'data-testid': `${dataTestid}-timers-tab`,
  },
  {
    labelKey: 'notifications',
    id: 'event-form-notifications',
    content: <NotificationsTab data-testid={`${dataTestid}-availability`} />,
    hasError: hasNotificationsErrors,
    'data-testid': `${dataTestid}-notifications-tab`,
  },
];

export const getStartEndComparison = (startTime: string, endTime: string) => {
  const startDate = new Date(`2000-01-01T${startTime}:00`);
  const endDate = new Date(`2000-01-01T${endTime}:00`);

  return startDate < endDate;
};

export const getNextDayComparison = (startTime: string, endTime: string) =>
  !getStartEndComparison(startTime, endTime) && startTime !== endTime;

export const getBetweenStartEndComparison = (
  notificationTime: string,
  startTime: string,
  endTime: string,
) => {
  const timeDate = new Date(`1970-01-01T${notificationTime}:00.000Z`);
  const startTimeDate = new Date(`1970-01-01T${startTime}:00.000Z`);
  const endTimeDate = new Date(`1970-01-01T${endTime}:00.000Z`);

  return timeDate >= startTimeDate && timeDate <= endTimeDate;
};

export const getBetweenStartEndNextDaySingleComparison = ({
  time,
  rangeStartTime,
  rangeEndTime,
}: GetBetweenStartEndNextDaySingleComparisonProps) => {
  const timeDate = new Date(`1970-01-01T${time}:00.000Z`);
  const startTimeDate = new Date(`1970-01-01T${rangeStartTime}:00.000Z`);
  const endTimeDate = new Date(`1970-01-01T${rangeEndTime}:00.000Z`);
  const endOfCurrentDay = new Date('1970-01-01T23:59:00.000Z');
  const startOfCurrentDay = new Date('1970-01-01T00:00:00.000Z');

  if (startTimeDate > endTimeDate)
    return (
      (startTimeDate <= timeDate && timeDate <= endOfCurrentDay) ||
      (startOfCurrentDay <= timeDate && timeDate <= endTimeDate)
    );

  return startTimeDate <= timeDate && timeDate <= endTimeDate;
};

export const getBetweenStartEndNextDayComparison = ({
  time,
  fromTime,
  toTime,
  rangeStartTime,
  rangeEndTime,
}: GetBetweenStartEndNextDayComparisonProps) => {
  const isFromTime = time === fromTime;
  const isCrossDay = getNextDayComparison(fromTime, toTime);
  const timeDate = new Date(`1970-01-01T${time}:00.000Z`);
  const startTimeDate = new Date(`1970-01-01T${rangeStartTime}:00.000Z`);
  const endTimeDate = new Date(`1970-01-01T${rangeEndTime}:00.000Z`);
  const fromTimeDate = new Date(`1970-01-01T${fromTime}:00.000Z`);
  const toTimeDate = new Date(`1970-01-01T${toTime}:00.000Z`);
  const endOfCurrentDay = new Date('1970-01-01T23:59:00.000Z');
  const startOfCurrentDay = new Date('1970-01-01T00:00:00.000Z');

  if (startTimeDate > endTimeDate) {
    if (isFromTime) {
      if (isCrossDay) {
        return startTimeDate <= timeDate && timeDate <= endOfCurrentDay;
      }

      return startTimeDate <= timeDate || timeDate <= endTimeDate;
    }

    if (isCrossDay) {
      return startOfCurrentDay <= timeDate && timeDate <= endTimeDate;
    }

    return startTimeDate <= timeDate || timeDate <= endTimeDate;
  }

  if (isCrossDay) {
    return false;
  }

  if (isFromTime) {
    return startTimeDate <= timeDate && timeDate <= toTimeDate && timeDate <= endTimeDate;
  }

  return startTimeDate <= timeDate && fromTimeDate <= timeDate && timeDate <= endTimeDate;
};

export const getTimeComparison = (message: string) =>
  yup.string().when('alwaysAvailable', {
    is: false,
    then: (schema) =>
      schema.test('is-valid-period', message, function scheduledStartEnd() {
        const { startTime, endTime } = this.parent;
        if (!startTime || !endTime) {
          return true;
        }

        return startTime !== endTime;
      }),
    otherwise: (schema) => schema,
  });

export const getTimerDurationCheck = () => {
  const timerDurationCheck = t('timerDurationCheck');

  return yup.string().test('is-valid-duration', timerDurationCheck, (value) => {
    if (!value) {
      return false;
    }
    const [hours, minutes] = value.split(':');

    return Number(hours) > 0 || Number(minutes) > 0;
  });
};

export const getNotificationTimeComparison = ({
  schema,
  field,
  showValidPeriodMessage,
  isSingleTime = false,
}: GetNotificationTimeComparisonProps) => {
  const selectValidPeriod = t('selectValidPeriod');
  const activityUnavailableAtTime = t('activityUnavailableAtTime');

  return schema
    .required(getIsRequiredValidateMessage(field))
    .test(
      'is-valid-period',
      showValidPeriodMessage ? selectValidPeriod : '',
      function notificationValidPeriodTest(_: string, testContext: NotificationTimeTestContext) {
        const { fromTime, toTime } = testContext.parent;

        if ((field !== 'fromTime' && field !== 'toTime') || !fromTime || !toTime) {
          return true;
        }

        return fromTime !== toTime;
      },
    )
    .test(
      'after-start-time-before-end-time',
      activityUnavailableAtTime,
      function notificationStartEndTest(value: string, testContext: NotificationTimeTestContext) {
        const startTimeValue = testContext.from[1].value.startTime;
        const endTimeValue = testContext.from[1].value.endTime;
        const { fromTime, toTime } = testContext.parent;

        if (
          !startTimeValue ||
          !endTimeValue ||
          !value ||
          (fromTime === toTime && typeof toTime === 'string')
        ) {
          return true;
        }

        if (isSingleTime)
          return getBetweenStartEndNextDaySingleComparison({
            time: value,
            rangeStartTime: startTimeValue,
            rangeEndTime: endTimeValue,
          });

        return getBetweenStartEndNextDayComparison({
          time: value,
          fromTime,
          toTime,
          rangeStartTime: startTimeValue,
          rangeEndTime: endTimeValue,
        });
      },
    );
};

export const getNotificationsValidation = ({
  field,
  notificationType,
  showValidPeriodMessage,
  isSingleTime = false,
}: GetNotificationsValidationProps) =>
  yup
    .string()
    .nullable()
    .when('triggerType', ([triggerType]: NotificationType[], schema) => {
      if (triggerType === notificationType) {
        return getNotificationTimeComparison({
          schema,
          field,
          showValidPeriodMessage,
          isSingleTime,
        });
      }

      return schema;
    });

const createTimeEntity = (timeQuantity: number) => timeQuantity.toString().padStart(2, '0');

export const convertSecondsToHHmmString = (timeInSeconds: number) => {
  const date = new Date(timeInSeconds * SECONDS_TO_MILLISECONDS_MULTIPLIER);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();

  return `${createTimeEntity(hours)}:${createTimeEntity(minutes)}`;
};

const getActivityOrFlowId = (
  editedEvent?: CalendarEvent,
  startFlowIcon?: boolean,
  eventActivityOrFlowId?: string,
) => {
  if (!editedEvent) return '';
  if (startFlowIcon) return `flow-${eventActivityOrFlowId}`;

  return eventActivityOrFlowId;
};

const getStartEndDates = (
  isPeriodicityOnce: boolean,
  isPeriodicityAlways: boolean,
  defaultStartDate: Date,
  eventStart?: Date,
  eventEnd?: Date | null,
  editedEvent?: CalendarEvent,
) => {
  if (isPeriodicityOnce || isPeriodicityAlways) {
    return { startDate: defaultStartDate, endDate: endOfYear(defaultStartDate) };
  }

  return {
    startDate: eventStart || defaultStartDate,
    endDate:
      editedEvent && eventEnd === null
        ? null
        : eventEnd || endOfYear(eventStart || defaultStartDate),
  };
};

const getNotifications = (type: SecondsManipulation, notifications?: EventNotifications) =>
  notifications?.map((notification) => {
    const { atTime, fromTime, toTime } = notification || {};
    if (notification.triggerType === NotificationType.Fixed) {
      return {
        ...notification,
        atTime:
          type === SecondsManipulation.AddSeconds
            ? addSecondsToHourMinutes(atTime)
            : removeSecondsFromTime(atTime),
      };
    }

    return {
      ...notification,
      fromTime:
        type === SecondsManipulation.AddSeconds
          ? addSecondsToHourMinutes(fromTime)
          : removeSecondsFromTime(fromTime),
      toTime:
        type === SecondsManipulation.AddSeconds
          ? addSecondsToHourMinutes(toTime)
          : removeSecondsFromTime(toTime),
    };
  }) || null;

const getReminder = ({
  type,
  reminder,
  isMonthlyPeriodicity,
  startDate,
}: {
  type: SecondsManipulation;
  reminder?: FormReminder;
  isMonthlyPeriodicity: boolean;
  startDate: Date;
}) => {
  if (!reminder) return null;
  const isFromForm = type === SecondsManipulation.AddSeconds;
  const activityIncompleteDate =
    isMonthlyPeriodicity && !isFromForm && startDate
      ? addDays(startDate, reminder.activityIncomplete)
      : undefined;
  const activityIncomplete =
    isMonthlyPeriodicity && isFromForm && startDate && reminder.activityIncompleteDate
      ? differenceInDays(reminder.activityIncompleteDate, startDate)
      : reminder.activityIncomplete;

  return {
    activityIncomplete,
    activityIncompleteDate,
    reminderTime: isFromForm
      ? addSecondsToHourMinutes(reminder.reminderTime)
      : removeSecondsFromTime(reminder.reminderTime),
  };
};

export const getDefaultValues = (defaultStartDate: Date, editedEvent?: CalendarEvent) => {
  const {
    alwaysAvailable: eventAlwaysAvailable,
    start,
    end,
    eventStart,
    eventEnd,
    periodicity: eventPeriodicity,
    activityOrFlowId: eventActivityOrFlowId,
    startFlowIcon,
    oneTimeCompletion: eventOneTimeCompletion,
    accessBeforeSchedule: eventAccessBeforeSchedule,
    timerType: eventTimerType,
    timer,
    notification,
  } = editedEvent || {};
  const activityOrFlowId = getActivityOrFlowId(editedEvent, startFlowIcon, eventActivityOrFlowId);
  const isPeriodicityAlways = eventPeriodicity === Periodicity.Always;
  const isPeriodicityOnce = eventPeriodicity === Periodicity.Once;
  const alwaysAvailable = editedEvent ? eventAlwaysAvailable : true;
  const date = isPeriodicityOnce ? eventStart : defaultStartDate;
  const { startDate, endDate } = getStartEndDates(
    isPeriodicityOnce,
    isPeriodicityAlways,
    defaultStartDate,
    eventStart,
    eventEnd,
    editedEvent,
  );
  const startTime = start ? format(start, DateFormats.Time) : DEFAULT_START_TIME;
  const endTime = end ? format(end, DateFormats.Time) : DEFAULT_END_TIME;
  const periodicity = editedEvent?.periodicity || Periodicity.Once;
  const oneTimeCompletion = eventOneTimeCompletion || false;
  const accessBeforeSchedule = eventAccessBeforeSchedule ?? false;
  const timerType = eventTimerType || TimerType.NotSet;
  const timerHHmmString = timer && convertSecondsToHHmmString(timer);
  const timerDuration =
    (timerType === TimerType.Timer && timerHHmmString) || DEFAULT_TIMER_DURATION;
  const idleTime = (timerType === TimerType.Idle && timerHHmmString) || DEFAULT_IDLE_TIME;
  const notifications =
    getNotifications(SecondsManipulation.RemoveSeconds, notification?.notifications) || [];
  const reminder =
    getReminder({
      type: SecondsManipulation.RemoveSeconds,
      reminder: notification?.reminder,
      isMonthlyPeriodicity: periodicity === Periodicity.Monthly,
      startDate,
    }) || null;

  return {
    activityOrFlowId,
    alwaysAvailable,
    oneTimeCompletion,
    startTime,
    endTime,
    date,
    startDate,
    endDate,
    accessBeforeSchedule,
    timerType,
    timerDuration,
    idleTime,
    periodicity,
    notifications,
    reminder,
    removeWarning: {},
  };
};

export const getActivitiesFlows = (activities: Activity[], activityFlows: ActivityFlow[]) => [
  ...activities.map(({ id, name, isHidden }) => ({
    value: id!,
    labelKey: name,
    ...(isHidden && {
      disabled: true,
      tooltip: t('activityDeactivated'),
    }),
  })),
  ...activityFlows.map(({ id, name, isHidden }) => ({
    value: `flow-${id}`,
    labelKey: name,
    icon: <Svg id="flow" width="15" height="15" />,
    ...(isHidden && {
      disabled: true,
      tooltip: t('flowDeactivated'),
    }),
  })),
];

export const addSecondsToHourMinutes = (timeStr?: string | null) =>
  timeStr ? `${timeStr}:00` : null;

const getTimer = (timerType: TimerType, timerDuration: string, idleTime: string) => {
  switch (timerType) {
    case TimerType.Timer:
      return addSecondsToHourMinutes(timerDuration) || undefined;
    case TimerType.Idle:
      return addSecondsToHourMinutes(idleTime) || undefined;
  }
};

export const getIdWithoutRegex = (activityOrFlowId: string) => {
  const regexWithFlow = /^flow-/;
  const isFlowId = regexWithFlow.test(activityOrFlowId);
  const id = activityOrFlowId.replace(regexWithFlow, '');

  return { isFlowId, id };
};

export const getEventPayload = (
  defaultStartDate: Date,
  getValues: UseFormGetValues<EventFormValues>,
  respondentId?: string,
) => {
  const [
    activityOrFlowId,
    alwaysAvailable,
    oneTimeCompletion,
    timerType,
    timerDuration,
    idleTime,
    periodicity,
    startTime,
    endTime,
    accessBeforeSchedule,
    date,
    startDate,
    endDate,
    notificationsFromForm,
    reminderFromForm,
  ] = getValues([
    'activityOrFlowId',
    'alwaysAvailable',
    'oneTimeCompletion',
    'timerType',
    'timerDuration',
    'idleTime',
    'periodicity',
    'startTime',
    'endTime',
    'accessBeforeSchedule',
    'date',
    'startDate',
    'endDate',
    'notifications',
    'reminder',
  ]);
  const notifications = getNotifications(SecondsManipulation.AddSeconds, notificationsFromForm);
  const reminder = getReminder({
    type: SecondsManipulation.AddSeconds,
    reminder: reminderFromForm,
    isMonthlyPeriodicity: periodicity === Periodicity.Monthly,
    startDate: startDate as Date,
  });
  const { isFlowId, id: flowId } = getIdWithoutRegex(activityOrFlowId);

  const body: CreateEventType['body'] = {
    respondentId,
    timerType,
    notification:
      notifications?.length || reminder
        ? {
            notifications,
            reminder,
          }
        : null,
    ...(isFlowId ? { flowId } : { activityId: activityOrFlowId }),
  };

  body.timer = getTimer(timerType, timerDuration, idleTime);

  if (alwaysAvailable) {
    body.oneTimeCompletion = oneTimeCompletion;
    body.periodicity = {
      type: Periodicity.Always,
      ...(defaultStartDate && {
        selectedDate: convertDateToYearMonthDay(defaultStartDate),
      }),
    };
  } else {
    body.startTime = addSecondsToHourMinutes(startTime) || undefined;
    body.endTime = addSecondsToHourMinutes(endTime) || undefined;
    body.accessBeforeSchedule = accessBeforeSchedule;

    body.periodicity = {
      type: periodicity,
      ...(periodicity === Periodicity.Once
        ? {
            selectedDate: convertDateToYearMonthDay(date),
          }
        : {
            ...(startDate && {
              startDate: convertDateToYearMonthDay(startDate),
            }),
            ...(endDate && {
              endDate: convertDateToYearMonthDay(endDate),
            }),
          }),

      ...(startDate &&
        (periodicity === Periodicity.Weekly || periodicity === Periodicity.Monthly) && {
          selectedDate: convertDateToYearMonthDay(startDate),
        }),
    };
  }

  return body;
};

export const getDaysInPeriod = ({ isCrossDayEvent, startDate, endDate }: GetDaysInPeriod) => {
  const end = isCrossDayEvent ? addDays(endDate, 1) : endDate;

  return startDate && endDate && endDate > startDate
    ? eachDayOfInterval({
        start: startDate,
        end,
      })
    : [];
};

export const getWeeklyDays = ({ daysInPeriod, startDate, isCrossDayEvent }: GetWeeklyDays) => {
  const dayOfWeek = getDay(startDate);
  let weeklyDaysCount = 0;

  return daysInPeriod.reduce((acc: number[], date) => {
    if (getDay(date) === dayOfWeek) {
      const weeklyDayNumber = weeklyDaysCount * 7;
      acc.push(weeklyDayNumber);
      isCrossDayEvent && acc.push(weeklyDayNumber + 1);
      weeklyDaysCount++;
    }

    return acc;
  }, []);
};

const getActivityIncompleteCommonFields = (formContext: yup.TestContext<yup.AnyObject>) => {
  const startDate = formContext.from?.[1]?.value?.startDate;
  const endDate = formContext.from?.[1]?.value?.endDate;
  const startTime = formContext.from?.[1]?.value?.startTime;
  const endTime = formContext.from?.[1]?.value?.endTime;
  const periodicity = formContext.from?.[1]?.value?.periodicity;
  const isCrossDayEvent = getNextDayComparison(startTime, endTime);

  return { startDate, endDate, periodicity, isCrossDayEvent };
};

export const getActivityIncompleteValidation = () =>
  yup
    .number()
    .test(
      'activity-availability-at-day',
      t('activityIsUnavailable'),
      function activityAvailabilityAtDayTest(value) {
        if (!value || value === 0) return true;
        const { startDate, endDate, periodicity, isCrossDayEvent } =
          getActivityIncompleteCommonFields(this);
        const daysInPeriod = getDaysInPeriod({ isCrossDayEvent, startDate, endDate });
        if (periodicity === Periodicity.Once) {
          return value < ONCE_ACTIVITY_INCOMPLETE_LIMITATION;
        }
        if (periodicity === Periodicity.Daily || periodicity === Periodicity.Weekdays) {
          return value < daysInPeriod.length;
        }
        if (periodicity === Periodicity.Weekly) {
          const weeklyDays = getWeeklyDays({ daysInPeriod, startDate, isCrossDayEvent });

          return weeklyDays.includes(value);
        }

        return true;
      },
    );

export const getActivityIncompleteDateValidation = () =>
  yup
    .date()
    .test(
      'activity-incomplete-date',
      t('activityIsUnavailable'),
      function activityIncompleteDateTest(value) {
        if (!value) return true;
        const { startDate, endDate, periodicity, isCrossDayEvent } =
          getActivityIncompleteCommonFields(this);
        if (periodicity === Periodicity.Monthly) {
          const testedDate = format(value, DateFormats.YearMonthDay);
          const includedMonthlyDates = getDaysInMonthlyPeriodicity({
            chosenDate: getDate(startDate),
            eventStart: startDate,
            eventEnd: endDate,
            returnStringDate: true,
          }) as string[];
          const includedMonthlyDatesCrossDay = isCrossDayEvent
            ? includedMonthlyDates.reduce(
                (acc: string[], date) => [
                  ...acc,
                  date,
                  format(addDays(new Date(date), 1), DateFormats.YearMonthDay),
                ],
                [],
              )
            : null;

          return (includedMonthlyDatesCrossDay || includedMonthlyDates).includes(testedDate);
        }

        return true;
      },
    );

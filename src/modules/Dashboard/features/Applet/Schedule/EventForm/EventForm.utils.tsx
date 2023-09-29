import { UseFormWatch } from 'react-hook-form';
import { endOfYear, format } from 'date-fns';
import * as yup from 'yup';

import i18n from 'i18n';
import { DateFormats } from 'shared/consts';
import { Svg } from 'shared/components/Svg';
import { Activity, ActivityFlow } from 'shared/state';
import {
  CreateEventType,
  EventNotifications,
  EventReminder,
  NotificationType,
  Periodicity,
  TimerType,
} from 'modules/Dashboard/api';
import { CalendarEvent } from 'modules/Dashboard/state';
import { getIsRequiredValidateMessage } from 'shared/utils';

import { convertDateToYearMonthDay, removeSecondsFromTime } from '../Schedule.utils';
import { AvailabilityTab } from './AvailabilityTab';
import { NotificationsTab } from './NotificationsTab';
import { TimersTab } from './TimersTab';
import {
  DEFAULT_END_TIME,
  DEFAULT_IDLE_TIME,
  DEFAULT_START_TIME,
  DEFAULT_TIMER_DURATION,
  SECONDS_TO_MILLISECONDS_MULTIPLIER,
} from './EventForm.const';
import {
  EventFormValues,
  NotificationTimeTestContext,
  SecondsManipulation,
  GetEventFromTabs,
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
    content: <TimersTab data-testid={`${dataTestid}-availability`} />,
    hasError: hasTimerErrors,
    'data-testid': `${dataTestid}-timers-tab`,
  },
  {
    labelKey: 'notifications',
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

export const getTimeComparison = (message: string) =>
  yup.string().when('alwaysAvailable', {
    is: false,
    then: (schema) =>
      schema.test('is-valid-period', message, function () {
        const { startTime, endTime } = this.parent;
        if (!startTime || !endTime) {
          return true;
        }

        return getStartEndComparison(startTime, endTime);
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

export const getNotificationTimeComparison = (
  schema:
    | yup.Schema<EventReminder>
    | yup.StringSchema<string | null | undefined, yup.AnyObject, string | null | undefined>,
  field: string,
  showValidPeriodMessage: boolean,
) => {
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

        return getStartEndComparison(fromTime, toTime);
      },
    )
    .test(
      'after-start-time-before-end-time',
      activityUnavailableAtTime,
      function notificationStartEndTest(value: string, testContext: NotificationTimeTestContext) {
        const startTimeValue = testContext.from[1].value.startTime;
        const endTimeValue = testContext.from[1].value.endTime;

        if (!startTimeValue || !endTimeValue || !value) {
          return true;
        }

        return getBetweenStartEndComparison(value, startTimeValue, endTimeValue);
      },
    );
};

export const getNotificationsValidation = (
  field: string,
  notificationType: NotificationType,
  showValidPeriodMessage: boolean,
) =>
  yup
    .string()
    .nullable()
    .when('triggerType', ([triggerType]: NotificationType[], schema) => {
      if (triggerType === notificationType) {
        return getNotificationTimeComparison(schema, field, showValidPeriodMessage);
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

const getReminder = (type: SecondsManipulation, reminder?: EventReminder) => {
  if (!reminder) return null;

  return {
    ...reminder,
    reminderTime:
      type === SecondsManipulation.AddSeconds
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
  const periodicity =
    editedEvent && !isPeriodicityAlways ? editedEvent.periodicity : Periodicity.Once;
  const oneTimeCompletion = eventOneTimeCompletion || false;
  const accessBeforeSchedule = eventAccessBeforeSchedule || false;
  const timerType = eventTimerType || TimerType.NotSet;
  const timerHHmmString = timer && convertSecondsToHHmmString(timer);
  const timerDuration =
    (timerType === TimerType.Timer && timerHHmmString) || DEFAULT_TIMER_DURATION;
  const idleTime = (timerType === TimerType.Idle && timerHHmmString) || DEFAULT_IDLE_TIME;
  const notifications =
    getNotifications(SecondsManipulation.RemoveSeconds, notification?.notifications) || [];
  const reminder = getReminder(SecondsManipulation.RemoveSeconds, notification?.reminder) || null;

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
  watch: UseFormWatch<EventFormValues>,
  respondentId?: string,
) => {
  const activityOrFlowId = watch('activityOrFlowId');
  const alwaysAvailable = watch('alwaysAvailable');
  const oneTimeCompletion = watch('oneTimeCompletion');
  const timerType = watch('timerType');
  const timerDuration = watch('timerDuration');
  const idleTime = watch('idleTime');
  const periodicity = watch('periodicity');
  const startTime = watch('startTime');
  const endTime = watch('endTime');
  const accessBeforeSchedule = watch('accessBeforeSchedule');
  const date = watch('date');
  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const notificationsFromForm = watch('notifications');
  const notifications = getNotifications(SecondsManipulation.AddSeconds, notificationsFromForm);
  const reminderFromForm = watch('reminder');
  const reminder = getReminder(SecondsManipulation.AddSeconds, reminderFromForm);
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

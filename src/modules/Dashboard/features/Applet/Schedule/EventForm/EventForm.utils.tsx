import { UseFormWatch } from 'react-hook-form';
import { endOfYear, format } from 'date-fns';

import i18n from 'i18n';
import { DateFormats } from 'shared/consts';
import { Svg } from 'shared/components';
import { Activity, ActivityFlow } from 'shared/state';
import { CreateEventType, Periodicity, TimerType } from 'modules/Dashboard/api';
import { CalendarEvent } from 'modules/Dashboard/state';

import {
  DEFAULT_END_TIME,
  DEFAULT_START_TIME,
  DEFAULT_TIMER_DURATION,
  DEFAULT_IDLE_TIME,
  SECONDS_TO_MILLISECONDS_MULTIPLIER,
} from './EventForm.const';
import { EventFormValues } from './EventForm.types';

const { t } = i18n;

const createTimeEntity = (timeQuantity: number) => timeQuantity.toString().padStart(2, '0');

export const convertSecondsToHHmmString = (timeInSeconds: number) => {
  const date = new Date(timeInSeconds * SECONDS_TO_MILLISECONDS_MULTIPLIER);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();

  return `${createTimeEntity(hours)}:${createTimeEntity(minutes)}`;
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
  } = editedEvent || {};
  const activityOrFlowId = (() => {
    if (!editedEvent) return '';
    if (startFlowIcon) return `flow-${eventActivityOrFlowId}`;

    return eventActivityOrFlowId;
  })();
  const isPeriodicityAlways = eventPeriodicity === Periodicity.Always;
  const isPeriodicityOnce = eventPeriodicity === Periodicity.Once;
  const alwaysAvailable = editedEvent ? eventAlwaysAvailable : true;
  const date = isPeriodicityOnce ? eventStart : defaultStartDate;
  const startEndingDate = (() => {
    if (isPeriodicityOnce || isPeriodicityAlways) {
      return [defaultStartDate, endOfYear(defaultStartDate)];
    }

    return [
      eventStart || defaultStartDate,
      editedEvent && eventEnd === null
        ? null
        : eventEnd || endOfYear(eventStart || defaultStartDate),
    ];
  })();
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

  return {
    activityOrFlowId,
    alwaysAvailable,
    oneTimeCompletion,
    startTime,
    endTime,
    date,
    startEndingDate,
    accessBeforeSchedule,
    timerType,
    timerDuration,
    idleTime,
    periodicity,
    notifications: [],
    reminder: null,
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

const convertDateToYearMonthDay = (date: Date | string) =>
  typeof date === 'string' ? date : format(date, DateFormats.YearMonthDay);

const addSecondsToHourMinutes = (timeStr: string) => `${timeStr}:00`;

const getTimer = (
  timerType: TimerType,
  body: CreateEventType['body'],
  timerDuration: string,
  idleTime: string,
) => {
  switch (timerType) {
    case TimerType.Timer:
      return (body.timer = addSecondsToHourMinutes(timerDuration));
    case TimerType.Idle:
      return (body.timer = addSecondsToHourMinutes(idleTime));
  }
};

const getFlowIdWithoutRegex = (activityOrFlowId: string) => {
  const regexWithFlow = /^flow-/;
  const isFlowId = regexWithFlow.test(activityOrFlowId);
  const flowId = activityOrFlowId.replace(regexWithFlow, '');

  return { isFlowId, flowId };
};

export const getEventPayload = (defaultStartDate: Date, watch: UseFormWatch<EventFormValues>) => {
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
  const startEndingDate = watch('startEndingDate');

  const { isFlowId, flowId } = getFlowIdWithoutRegex(activityOrFlowId);

  const body: CreateEventType['body'] = {
    timerType,
    ...(isFlowId ? { flowId } : { activityId: activityOrFlowId }),
  };

  getTimer(timerType, body, timerDuration, idleTime);

  if (alwaysAvailable) {
    body.oneTimeCompletion = oneTimeCompletion;
    body.periodicity = {
      type: Periodicity.Always,
      ...(defaultStartDate && {
        selectedDate: convertDateToYearMonthDay(defaultStartDate),
      }),
    };
  } else {
    body.startTime = addSecondsToHourMinutes(startTime);
    body.endTime = addSecondsToHourMinutes(endTime);
    body.accessBeforeSchedule = accessBeforeSchedule;

    body.periodicity = {
      type: periodicity,
      ...(periodicity === Periodicity.Once
        ? {
            selectedDate: convertDateToYearMonthDay(date),
          }
        : {
            ...(startEndingDate[0] && {
              startDate: convertDateToYearMonthDay(startEndingDate[0]),
            }),
            ...(startEndingDate[1] && {
              endDate: convertDateToYearMonthDay(startEndingDate[1]),
            }),
          }),

      ...(defaultStartDate &&
        (periodicity === Periodicity.Weekly || periodicity === Periodicity.Monthly) && {
          selectedDate: convertDateToYearMonthDay(defaultStartDate),
        }),
    };
  }

  return body;
};

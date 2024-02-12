import { Dispatch, SetStateAction } from 'react';

import * as yup from 'yup';

import {
  TimerType,
  Periodicity,
  EventNotifications,
  EventReminder,
  NotificationType,
} from 'modules/Dashboard/api';
import { CalendarEvent } from 'modules/Dashboard/state';

export type EventFormRef = {
  submitForm: () => void;
  processEvent: () => void;
};

export type EventFormProps = {
  submitCallback: () => void;
  setRemoveAllScheduledPopupVisible: Dispatch<SetStateAction<boolean>>;
  setRemoveAlwaysAvailablePopupVisible: Dispatch<SetStateAction<boolean>>;
  setActivityName: Dispatch<SetStateAction<string>>;
  defaultStartDate: Date;
  onFormIsLoading: (isLoading: boolean) => void;
  editedEvent?: CalendarEvent;
  onFormChange?: (isChanged: boolean) => void;
  'data-testid'?: string;
};

export type Warning = {
  showRemoveAlwaysAvailable?: boolean;
  showRemoveAllScheduled?: boolean;
};

export type FormReminder = EventReminder | null;

export type EventFormValues = {
  activityOrFlowId: string;
  alwaysAvailable: boolean;
  oneTimeCompletion: boolean;
  periodicity: Periodicity;
  startTime: string;
  endTime: string;
  date: Date | string;
  startDate: Date | string;
  endDate: Date | string | null;
  accessBeforeSchedule: boolean;
  timerType: TimerType;
  timerDuration: string;
  idleTime: string;
  notifications: EventNotifications;
  reminder: FormReminder;
  removeWarning: Warning;
};

export type NotificationTimeTestContext = {
  parent: {
    fromTime: string;
    toTime: string;
  };
  from: {
    value: {
      startTime: string;
      endTime: string;
    };
  }[];
};

export type StartEndTimeTestContext = {
  parent: {
    startTime: string;
    endTime: string;
  };
};

export const enum SecondsManipulation {
  AddSeconds,
  RemoveSeconds,
}

export type GetEventFromTabs = {
  hasAvailabilityErrors?: boolean;
  hasTimerErrors?: boolean;
  hasNotificationsErrors?: boolean;
  hasAlwaysAvailableOption?: boolean;
  'data-testid'?: string;
};

export type GetDaysInPeriod = {
  isCrossDayEvent: boolean;
  startDate: Date;
  endDate: Date;
};

export type GetWeeklyDays = {
  daysInPeriod: Date[];
  startDate: Date;
  isCrossDayEvent: boolean;
};

/** For ex., startTime: '00:00', endTime: '23:59' */
export type UseNextDayLabelProps = { startTime: string; endTime: string };

export type GetBetweenStartEndNextDaySingleComparisonProps = {
  time: string;
  rangeStartTime: string;
  rangeEndTime: string;
};

export type GetBetweenStartEndNextDayComparisonProps = {
  time: string;
  fromTime: string;
  toTime: string;
  rangeStartTime: string;
  rangeEndTime: string;
};

export type GetNotificationTimeComparisonProps = {
  schema:
    | yup.Schema<EventReminder>
    | yup.StringSchema<string | null | undefined, yup.AnyObject, string | null | undefined>;
  field: string;
  showValidPeriodMessage: boolean;
  isSingleTime: boolean;
};

export type GetNotificationsValidationProps = {
  field: string;
  notificationType: NotificationType;
  showValidPeriodMessage: boolean;
  isSingleTime: boolean;
};

export type GetReminderTimeComparison = {
  time: string;
  startTime: string;
  endTime: string;
  isCrossDay: boolean;
};

export type GetReminder = {
  type: SecondsManipulation;
  reminder?: FormReminder;
};

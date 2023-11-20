import { Dispatch, SetStateAction } from 'react';

import { TimerType, Periodicity, EventNotifications, EventReminder } from 'modules/Dashboard/api';
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

export type FormReminder = (EventReminder & { activityIncompleteDate?: Date }) | null;

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

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
  editedEvent?: CalendarEvent;
  onFormChange?: (isChanged: boolean) => void;
};

export type Warning = {
  showRemoveAlwaysAvailable?: boolean;
  showRemoveAllScheduled?: boolean;
};

export type EventFormValues = {
  activityOrFlowId: string;
  alwaysAvailable: boolean;
  oneTimeCompletion: boolean;
  periodicity: Periodicity;
  startTime: string;
  endTime: string;
  date: Date | string;
  startEndingDate: (Date | null)[] | string;
  accessBeforeSchedule: boolean;
  timerType: TimerType;
  timerDuration: string;
  idleTime: string;
  notifications: EventNotifications;
  reminder: EventReminder;
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

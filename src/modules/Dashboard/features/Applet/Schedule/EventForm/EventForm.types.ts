import { Dispatch, SetStateAction } from 'react';

import { TimerType, Periodicity } from 'modules/Dashboard/api';
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

export const enum NotificationType {
  Fixed = 'fixed',
  Random = 'random',
}

export type Notification = {
  at?: Date | null;
  from?: Date | null;
  to?: Date | null;
  type: NotificationType;
};

export type Reminder = { activityIncomplete: number; reminderTime: Date | null };

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
  notifications: Notification[] | null;
  reminder: Reminder | null;
};

import { Dispatch, SetStateAction } from 'react';

import { TimerType, Periodicity } from 'modules/Dashboard/api';

export type ActivityFormRef = {
  submitForm: () => void;
  createEvent: () => void;
};

export type ActivityFormProps = {
  submitCallback: () => void;
  setRemoveAllScheduledPopupVisible: Dispatch<SetStateAction<boolean>>;
  setRemoveAlwaysAvailablePopupVisible: Dispatch<SetStateAction<boolean>>;
  setActivityName: Dispatch<SetStateAction<string>>;
  defaultStartDate?: Date;
};

export const enum NotificationType {
  Fixed = 'fixed',
  Random = 'random',
}

export type Notification = {
  at?: Date | null;
  from?: Date | null;
  to?: Date | null;
};

export type Reminder = { activityIncomplete: number; reminderTime: Date | null };

export type FormValues = {
  activityOrFlowId: string;
  alwaysAvailable: boolean;
  oneTimeCompletion: boolean;
  periodicity: Periodicity;
  startTime: string;
  endTime: string;
  date: Date | string;
  startEndingDate: (Date | null)[] | string;
  defaultStartDate?: Date;
  accessBeforeSchedule: boolean;
  timerType: TimerType;
  timerDuration: string;
  idleTime: string;
  notifications: Notification[] | null;
  reminder: Reminder | null;
};

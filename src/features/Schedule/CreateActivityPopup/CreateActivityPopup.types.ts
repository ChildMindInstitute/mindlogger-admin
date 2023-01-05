export type CreateActivityPopupProps = {
  open: boolean;
  onClose: () => void;
};

export enum NotificationType {
  fixed = 'fixed',
  random = 'random',
}

export type Notification = {
  at?: Date | null;
  from?: Date | null;
  to?: Date | null;
};

export type Reminder = { activityIncomplete: number; reminderTime: Date | null };

export type FormValues = {
  activity: string;
  availability: boolean | string;
  completion: boolean;
  oneTimeCompletion: boolean;
  notifications: Notification[] | null;
  reminder: Reminder | null;
  date: string;
  from: string;
  to: string;
  startEndingDate: string;
  timeout: {
    access: boolean;
  };
  timerDuration: string;
  idleTime: string;
};

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
  availability: boolean;
  completion: boolean;
  oneTimeCompletion: boolean;
  notifications: Notification[] | null;
  reminder: Reminder | null;
  date: string;
  startEndingDate: string;
  timeout: {
    access: boolean;
  };
};

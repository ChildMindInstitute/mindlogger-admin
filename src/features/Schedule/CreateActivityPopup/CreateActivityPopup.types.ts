export type CreateActivityPopupProps = {
  open: boolean;
  onClose: () => void;
};

export enum SendNotificationType {
  fixed = 'fixed',
  random = 'random',
}

export type SendNotification = {
  type: SendNotificationType;
  timeAt?: Date | null;
  timeFrom?: Date | null;
  timeTo?: Date | null;
};

export type SendReminder = { activityIncomplete: number; reminderTime: Date | null };

export type FormValues = {
  activity: string;
  availability: boolean;
  completion: boolean;
  oneTimeCompletion: boolean;
  timeout: {
    access: boolean;
    allow: boolean;
  };
  notifications: {
    sendNotifications: SendNotification[] | null;
    sendReminder: SendReminder | null;
  };
};

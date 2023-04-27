import { NotificationType } from '../../EventForm.types';

export const notificationTimeToggles = [
  {
    value: NotificationType.Fixed,
    label: 'fixed',
    tooltip: 'sendNotificationAtFixedTime',
  },
  {
    value: NotificationType.Random,
    label: 'random',
    tooltip: 'sendNotificationAtRandomTime',
  },
];

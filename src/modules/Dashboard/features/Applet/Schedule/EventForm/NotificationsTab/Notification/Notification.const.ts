import { NotificationType } from 'modules/Dashboard/api';

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

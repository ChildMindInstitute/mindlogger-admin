import { NotificationType } from '../../CreateActivityPopup.types';

export const notificationTimeToggles = [
  {
    value: NotificationType.fixed,
    label: 'fixed',
    tooltip: 'sendNotificationAtFixedTime',
  },
  {
    value: NotificationType.random,
    label: 'random',
    tooltip: 'sendNotificationAtRandomTime',
  },
];

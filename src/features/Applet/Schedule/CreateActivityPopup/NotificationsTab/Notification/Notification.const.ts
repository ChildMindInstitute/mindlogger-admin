import { NotificationType } from 'features/Applet/Schedule/CreateActivityPopup/CreateActivityPopup.types';

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

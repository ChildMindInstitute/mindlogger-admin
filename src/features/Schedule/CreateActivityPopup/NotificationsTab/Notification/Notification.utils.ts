import { TFunction } from 'i18next';
import { SendNotificationType } from '../../CreateActivityPopup.types';

export const getNotificationTimeToggles = (t: TFunction) => [
  {
    value: SendNotificationType.fixed,
    label: t('fixed'),
    tooltip: t('sendNotificationAtFixedTime'),
  },
  {
    value: SendNotificationType.random,
    label: t('random'),
    tooltip: t('sendNotificationAtRandomTime'),
  },
];

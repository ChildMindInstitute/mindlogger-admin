import { TFunction } from 'i18next';

export const getNotificationTimeToggles = (t: TFunction) => [
  {
    value: 'fixed',
    label: t('fixed'),
  },
  {
    value: 'random',
    label: t('random'),
  },
];

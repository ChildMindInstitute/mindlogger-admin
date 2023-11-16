import * as yup from 'yup';

import i18n from 'i18n';
import { NotificationType } from 'modules/Dashboard/api';

import {
  getTimeComparison,
  getNotificationTimeComparison,
  getNotificationsValidation,
  getTimerDurationCheck,
} from './EventForm.utils';

export const EventFormSchema = () => {
  const { t } = i18n;
  const activityRequired = t('activityRequired');
  const selectValidPeriod = t('selectValidPeriod');

  const notificationSchema = yup.object().shape({
    atTime: getNotificationsValidation('atTime', NotificationType.Fixed, false),
    fromTime: getNotificationsValidation('fromTime', NotificationType.Random, true),
    toTime: getNotificationsValidation('toTime', NotificationType.Random, false),
  });

  return yup
    .object({
      activityOrFlowId: yup.string().required(activityRequired),
      timerDuration: getTimerDurationCheck(),
      idleTime: getTimerDurationCheck(),
      startTime: getTimeComparison(selectValidPeriod),
      endTime: getTimeComparison(''),
      notifications: yup.array().of(notificationSchema),
      reminder: yup
        .object()
        .nullable()
        .shape({
          reminderTime: getNotificationTimeComparison(
            yup.string().nullable(),
            'reminderTime',
            false,
          ),
        }),
    })
    .required();
};

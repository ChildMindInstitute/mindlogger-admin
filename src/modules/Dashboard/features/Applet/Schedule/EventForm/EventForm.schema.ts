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
    atTime: getNotificationsValidation({
      field: 'atTime',
      notificationType: NotificationType.Fixed,
      showValidPeriodMessage: false,
      isSingleTime: true,
    }),
    fromTime: getNotificationsValidation({
      field: 'fromTime',
      notificationType: NotificationType.Random,
      showValidPeriodMessage: true,
      isSingleTime: false,
    }),
    toTime: getNotificationsValidation({
      field: 'toTime',
      notificationType: NotificationType.Random,
      showValidPeriodMessage: false,
      isSingleTime: false,
    }),
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
          reminderTime: getNotificationTimeComparison({
            schema: yup.string().nullable(),
            field: 'reminderTime',
            showValidPeriodMessage: false,
            isSingleTime: true,
          }),
        }),
    })
    .required();
};

import * as yup from 'yup';

import i18n from 'i18n';
import { NotificationType, TimerType } from 'modules/Dashboard/api';

import {
  getTimeComparison,
  getNotificationTimeComparison,
  getNotificationsValidation,
} from './EventForm.utils';

export const EventFormSchema = () => {
  const { t } = i18n;
  const activityRequired = t('activityRequired');
  const timerDurationCheck = t('timerDurationCheck');
  const selectValidPeriod = t('selectValidPeriod');

  const notificationSchema = yup.object().shape({
    atTime: getNotificationsValidation('atTime', NotificationType.Fixed, false),
    fromTime: getNotificationsValidation('fromTime', NotificationType.Random, true),
    toTime: getNotificationsValidation('toTime', NotificationType.Random, false),
  });

  return yup
    .object({
      activityOrFlowId: yup.string().required(activityRequired),
      timerDuration: yup.string().when('timerType', {
        is: TimerType.Timer,
        then: yup.string().test('is-valid-duration', timerDurationCheck, (value) => {
          if (!value) {
            return false;
          }
          const [hours, minutes] = value.split(':');

          return Number(hours) > 0 || Number(minutes) > 0;
        }),
        otherwise: yup.string(),
      }),
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

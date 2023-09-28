import * as yup from 'yup';

import i18n from 'i18n';
import { EventReminder, NotificationType, Periodicity, TimerType } from 'modules/Dashboard/api';

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

  const notificationSchema = yup
    .object()
    .shape({
      atTime: getNotificationsValidation('atTime', NotificationType.Fixed, false),
      fromTime: getNotificationsValidation('fromTime', NotificationType.Random, true),
      toTime: getNotificationsValidation('toTime', NotificationType.Random, false),
      triggerType: yup.mixed<NotificationType>().oneOf(Object.values(NotificationType)).required(),
    })
    .required();

  return yup
    .object({
      activityOrFlowId: yup.string().required(activityRequired),
      alwaysAvailable: yup.boolean().required(),
      oneTimeCompletion: yup.boolean().required(),
      timerDuration: getTimerDurationCheck().required(),
      periodicity: yup.mixed<Periodicity>().oneOf(Object.values(Periodicity)).required(),
      date: yup.mixed<Date | string>().required(),
      startDate: yup.mixed<Date | string>().required(),
      endDate: yup.mixed<Date | string>().required().nullable(),
      accessBeforeSchedule: yup.boolean().required(),
      idleTime: getTimerDurationCheck().required(),
      timerType: yup.mixed<TimerType>().oneOf(Object.values(TimerType)).required(),
      startTime: getTimeComparison(selectValidPeriod).required(),
      endTime: getTimeComparison('').required(),
      notifications: yup.array().of(notificationSchema).required().nullable(),
      removeWarning: yup
        .object({
          showRemoveAlwaysAvailable: yup.boolean(),
          showRemoveAllScheduled: yup.boolean(),
        })
        .required(),
      reminder: yup
        .object({
          activityIncomplete: yup.number().required(),
          reminderTime: getNotificationTimeComparison(
            yup.string().nullable().required(),
            'reminderTime',
            false,
          ),
        })
        .required()
        .nullable() as yup.ObjectSchema<EventReminder>,
    })
    .required();
};

import * as yup from 'yup';
import { addDays, eachDayOfInterval, getDay } from 'date-fns';

import i18n from 'i18n';
import { NotificationType, Periodicity } from 'modules/Dashboard/api';
import { getNormalizedTimezoneDate } from 'shared/utils';

import {
  getTimeComparison,
  getNotificationTimeComparison,
  getNotificationsValidation,
  getTimerDurationCheck,
  getNextDayComparison,
} from './EventForm.utils';
import { ONCE_ACTIVITY_INCOMPLETE_LIMITATION } from './EventForm.const';

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
      // startTime: getTimeComparison(selectValidPeriod),
      // endTime: getTimeComparison(''),
      notifications: yup.array().of(notificationSchema),
      reminder: yup
        .object()
        .nullable()
        .shape({
          activityIncomplete: yup
            .number()
            .test(
              'activity-availability-at-day',
              t('activityIsUnavailable'),
              function activityAvailabilityAtDayTest(value) {
                if (!value || value === 0) return true;
                const startDate = this.from?.[1]?.value?.startDate;
                const endDate = this.from?.[1]?.value?.endDate;
                const startTime = this.from?.[1]?.value?.startTime;
                const endTime = this.from?.[1]?.value?.endTime;
                const periodicity = this.from?.[1]?.value?.periodicity;
                const isCrossDayEvent = getNextDayComparison(startTime, endTime);
                const end = isCrossDayEvent ? addDays(endDate, 1) : endDate;
                const daysInPeriod =
                  startDate && endDate && endDate > startDate
                    ? eachDayOfInterval({
                        start: startDate,
                        end,
                      })
                    : [];
                // console.log('form values', this.from?.[1]?.value);
                if (periodicity === Periodicity.Once) {
                  return value < ONCE_ACTIVITY_INCOMPLETE_LIMITATION;
                }
                if (periodicity === Periodicity.Daily || periodicity === Periodicity.Weekdays) {
                  return value < daysInPeriod.length;
                }
                if (periodicity === Periodicity.Weekly) {
                  const dayOfWeek = getDay(getNormalizedTimezoneDate(startDate));
                  let weeklyDaysCount = 0;
                  const weeklyDays = daysInPeriod.reduce((acc: number[], date) => {
                    if (getDay(date) === dayOfWeek) {
                      acc.push(weeklyDaysCount * 7);
                      weeklyDaysCount++;
                    }

                    return acc;
                  }, []);

                  return weeklyDays.includes(value);
                }

                return true;
              },
            ),
          reminderTime: getNotificationTimeComparison(
            yup.string().nullable(),
            'reminderTime',
            false,
          ),
        }),
    })
    .required();
};

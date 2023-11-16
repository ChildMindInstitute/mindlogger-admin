import * as yup from 'yup';
import {
  differenceInDays,
  eachDayOfInterval,
  eachWeekOfInterval,
  getDay,
  startOfWeek,
} from 'date-fns';

import i18n from 'i18n';
import { NotificationType, Periodicity } from 'modules/Dashboard/api';
import { getNormalizedTimezoneDate } from 'shared/utils';

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
                const periodicity = this.from?.[1]?.value?.periodicity;
                const daysInPeriod =
                  startDate && endDate && endDate > startDate
                    ? eachDayOfInterval({ start: startDate, end: endDate })
                    : [];
                console.log('form values', this.from?.[1]?.value);

                // const daysDifference = startDate && endDate && differenceInDays(endDate, startDate);
                if (periodicity === Periodicity.Daily) {
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
                  // console.log('day of week', dayOfWeek);
                  // console.log('weekly days', weeklyDays);
                  // const weeks = eachWeekOfInterval({ start: startDate, end: endDate });
                  // console.log('weeks', weeks);
                  // const indicesArray = weeks.map((_, index) => index * 7);
                  // console.log('Array of indices:', indicesArray);
                  // return false;
                }

                return true;

                //
                // if (!startTimeValue || !endTimeValue || !value) {
                //   return true;
                // }
                //
                // return getBetweenStartEndComparison(value, startTimeValue, endTimeValue);
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

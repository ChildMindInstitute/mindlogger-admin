import { addDays, eachDayOfInterval, getDay } from 'date-fns';

import {
  GetDaysInPeriod,
  GetWeeklyDays,
} from 'modules/Dashboard/features/Applet/Schedule/EventForm/EventForm.types';

export const getDaysInPeriod = ({ isCrossDayEvent, startDate, endDate }: GetDaysInPeriod) => {
  const end = isCrossDayEvent ? addDays(endDate, 1) : endDate;

  return startDate && endDate && endDate >= startDate
    ? eachDayOfInterval({
        start: startDate,
        end,
      })
    : [];
};

export const getWeeklyDays = ({ daysInPeriod, startDate, isCrossDayEvent }: GetWeeklyDays) =>
  daysInPeriod.reduce(
    (
      acc: {
        daysArr: number[];
        daysInfoArr: { dayNumber: number; isCrossDay: boolean }[];
        weeklyDaysCount: number;
      },
      currentDate,
    ) => {
      const dayOfWeek = getDay(currentDate);

      if (dayOfWeek === getDay(startDate)) {
        const weeklyDayNumber = acc.weeklyDaysCount * 7;
        acc.daysArr.push(weeklyDayNumber, ...(isCrossDayEvent ? [weeklyDayNumber + 1] : []));
        acc.daysInfoArr.push(
          {
            dayNumber: weeklyDayNumber,
            isCrossDay: false,
          },
          ...(isCrossDayEvent ? [{ dayNumber: weeklyDayNumber + 1, isCrossDay: true }] : []),
        );
        acc.weeklyDaysCount++;
      }

      return acc;
    },
    { daysArr: [], daysInfoArr: [], weeklyDaysCount: 0 },
  );

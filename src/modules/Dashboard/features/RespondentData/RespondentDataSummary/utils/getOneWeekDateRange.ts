import { subDays, startOfDay, endOfDay, isValid, parseISO } from 'date-fns';

export const getOneWeekDateRange = (dateString?: string | null) => {
  const endDate =
    dateString && isValid(parseISO(dateString)) ? endOfDay(new Date(dateString)) : null;
  const startDate = endDate ? startOfDay(subDays(endDate, 6)) : null;

  return {
    startDate,
    endDate,
  };
};

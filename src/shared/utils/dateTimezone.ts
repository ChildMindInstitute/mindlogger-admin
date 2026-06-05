import { format } from 'date-fns';

import { DateFormats } from 'shared/consts';

export const MINUTES_TO_MILLISECONDS_MULTIPLIER = 60 * 1000;

export const getNormalizeTimezoneData = (dateString: string) => {
  const dateTime = new Date(dateString).getTime();
  const userDateOffsetMilliseconds =
    new Date().getTimezoneOffset() * MINUTES_TO_MILLISECONDS_MULTIPLIER;

  return {
    dateTime,
    userDateOffsetMilliseconds,
  };
};

export const getDateInUserTimezone = (dateString: string) => {
  const { dateTime, userDateOffsetMilliseconds } = getNormalizeTimezoneData(dateString);

  return new Date(dateTime - userDateOffsetMilliseconds);
};

export const getNormalizedTimezoneDate = (dateString: string) => {
  const { dateTime, userDateOffsetMilliseconds } = getNormalizeTimezoneData(dateString);

  return new Date(dateTime + userDateOffsetMilliseconds);
};

export const formatDateAsUTC = (date: Date): string => {
  const utcDate = new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
  );

  return format(utcDate, DateFormats.shortISO);
};

export const getLast24hUTCRange = () => {
  const now = new Date();
  const oneDayAgo = new Date(now);
  oneDayAgo.setHours(now.getHours() - 24);

  return {
    fromDate: formatDateAsUTC(oneDayAgo),
    toDate: formatDateAsUTC(now),
  };
};

import { format, getISOWeek } from 'date-fns';

import { DateFormats } from 'shared/consts';
import i18n from 'i18n';
import { NameLength } from 'modules/Dashboard/features/Applet/Schedule/Calendar/Calendar.types';

const { t } = i18n;

export const formatToYearMonthDate = (date: Date) => format(date, DateFormats.DayMonthYear);

export const formatToWeekYear = (date: Date) => `${getISOWeek(date)} ${date.getFullYear()}`;

export const getMoreText = () => `${t('more').toLowerCase()}...`;

export const getDayName = (date: Date) =>
  date.toLocaleDateString(i18n.language, { weekday: NameLength.Long });

export const getMonthName = (date: Date, length?: NameLength) =>
  date.toLocaleString(i18n.language, { month: length || NameLength.Long });

export const formatToNumberDate = (date: Date) => format(new Date(date), DateFormats.YearMonthDay);

/**
 * Parses a date string to a Date object, appending 'T00:00:00Z' to remove timezone offset
 *
 * @param {String} dateStr - The date string from which to extract the raw hours and minutes.
 * @returns {Date} An object containing the extracted raw hours and minutes.
 * @throws {Error} Throws an error if the date string format is invalid.
 *
 * @example
 * const dateStr = '2025-01-01';
 * const date = parseDateToMidnightUTC(dateStr);
 * // date: 2025-01-01T00:00:00.000Z
 */

export const parseDateToMidnightUTC = (dateStr: string): Date => {
  const dateMatch = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);

  if (!dateMatch) {
    throw new Error('[parseDateToMidnightUTC] Invalid date string format');
  }

  return new Date(`${dateStr}T00:00:00Z`);
};

import { format, getISOWeek } from 'date-fns';

import i18n from 'i18n';
import { NameLength } from 'modules/Dashboard/features/Applet/Schedule/Calendar/Calendar.types';
import { DateFormats } from 'shared/consts';

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
 * Parses a date string to a Date object, appending 'T00:00:00' for cases in which time wants to be omitted.
 *
 * This is used when only the date is needed, but not the time. This avoids the issue where creating a date
 * with a string formatted `'yyyy-MM-dd'` will result in the date being set to the local time zone.
 *
 * For example:
 *
 * ```ts
 * const date = new Date('2025-01-01')
 * // date: Tue Dec 31 2024 18:00:00 GMT-0600
 * ```
 *
 * Will result in the date being set to the local time zone, hence if only the date was taken
 * into consideration, it would be off by 1 day (December 31st 2024).
 *
 * With the use of this function, the correct date is guaranteed:
 *
 * ```ts
 * const date = parseDateToMidnightLocal('2025-01-01')
 * // date: Wed Jan 01 2025 00:00:00 GMT-0600
 * ```
 *
 * Returning the desired date of January 1st 2025.
 *
 * @param {String} dateStr - The date string from which to extract the raw hours and minutes.
 * @returns {Date} An object containing the extracted raw hours and minutes.
 * @throws {Error} Throws an error if the date string format is invalid.
 *
 * @example
 * const dateStr = '2025-01-01';
 * const date = parseDateToMidnightLocal(dateStr);
 * // date: 2025-01-01T00:00:00.000
 */
export const parseDateToMidnightLocal = (dateStr: string): Date => {
  const dateMatch = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!dateMatch) {
    throw new Error('[parseDateToMidnightLocal] Invalid date string format');
  }

  return new Date(`${dateStr}T00:00:00`);
};

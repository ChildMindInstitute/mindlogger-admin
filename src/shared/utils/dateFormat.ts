import { format, getISOWeek } from 'date-fns';

import i18n from 'i18n';
import { NameLength } from 'modules/Dashboard/features/Applet/Schedule/Calendar/Calendar.types';
import { DateFormats } from 'shared/consts';

const { t } = i18n;

export const formatToYearMonthDate = (date: Date) => format(date, DateFormats.DayMonthYear);

export const formatToWeekYear = (date: Date) => `${getISOWeek(date)} ${date.getFullYear()}`;

export const getMoreText = () => `${t('more').toLowerCase()}...`;

export const getDayName = (date: Date) => date.toLocaleDateString(i18n.language, { weekday: NameLength.Long });

export const getMonthName = (date: Date, length?: NameLength) =>
  date.toLocaleString(i18n.language, { month: length || NameLength.Long });

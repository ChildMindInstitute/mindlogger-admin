import { Svg } from 'shared/components/Svg';
import i18n from 'i18n';

import { CalendarViews } from '../Calendar.types';

const { t } = i18n;

export const getCalendarViewButtons = () => [
  {
    value: CalendarViews.Day,
    label: t(CalendarViews.Day),
    icon: <Svg width="15.5" height="15.5" id="day-view" />,
  },
  {
    value: CalendarViews.Week,
    label: t(CalendarViews.Week),
    icon: <Svg width="15.5" height="15.5" id="week-view" />,
  },
  {
    value: CalendarViews.Month,
    label: t(CalendarViews.Month),
    icon: <Svg width="15.5" height="15.5" id="month-view" />,
  },
  {
    value: CalendarViews.Year,
    label: t(CalendarViews.Year),
    icon: <Svg width="15.5" height="15.5" id="year-view" />,
  },
];

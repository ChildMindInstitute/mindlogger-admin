import { Svg } from 'components';
import i18n from 'i18n';

import { CalendarView } from '../Calendar.types';

const { t } = i18n;

export const getCalendarViewButtons = () => [
  {
    value: CalendarView.day,
    label: t('day'),
    icon: <Svg id="day-view" />,
  },
  {
    value: CalendarView.week,
    label: t('week'),
    icon: <Svg id="week-view" />,
  },
  {
    value: CalendarView.month,
    label: t('month'),
    icon: <Svg id="month-view" />,
  },
  {
    value: CalendarView.year,
    label: t('year'),
    icon: <Svg id="year-view" />,
  },
];

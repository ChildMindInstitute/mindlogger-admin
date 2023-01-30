import { Svg } from 'components';
import i18n from 'i18n';

const { t } = i18n;

export const getCalendarViewButtons = () => [
  {
    value: 'day',
    label: t('day'),
    icon: <Svg id="day-view" />,
  },
  {
    value: 'week',
    label: t('week'),
    icon: <Svg id="week-view" />,
  },
  {
    value: 'month',
    label: t('month'),
    icon: <Svg id="month-view" />,
  },
  {
    value: 'year',
    label: t('year'),
    icon: <Svg id="year-view" />,
  },
];

import { Svg } from 'components';
import i18n from 'i18n';

const { t } = i18n;

export const getCalendarViewButtons = () => [
  {
    value: 'day',
    label: t('day'),
    icon: <Svg width="15.5" height="15.5" id="day-view" />,
  },
  {
    value: 'week',
    label: t('week'),
    icon: <Svg width="15.5" height="15.5" id="week-view" />,
  },
  {
    value: 'month',
    label: t('month'),
    icon: <Svg width="15.5" height="15.5" id="month-view" />,
  },
  {
    value: 'year',
    label: t('year'),
    icon: <Svg width="15.5" height="15.5" id="year-view" />,
  },
];

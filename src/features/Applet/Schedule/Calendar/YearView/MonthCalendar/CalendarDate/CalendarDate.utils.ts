import i18n from 'i18n';
import { CalendarEvent } from 'features/Applet/Schedule/Calendar/Calendar.types';

import { MAX_EVENTS_IN_TOOLTIP } from './CalendarDate.const';

const { t } = i18n;

export const getMoreEventsText = (events: CalendarEvent[]) =>
  `${events.length - MAX_EVENTS_IN_TOOLTIP} ${t('more').toLowerCase()}...`;

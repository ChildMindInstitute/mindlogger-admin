import { format } from 'date-fns';

import { CalendarEvent } from './Calendar.types';

export const getEventsWithOffRange = (events: CalendarEvent[], date: Date) =>
  events.map((event) => ({
    ...event,
    isOffRange: event.start.getMonth() !== date.getMonth(),
  }));

export const formatToYearMonthDate = (date?: Date) => date && format(date, 'yyyy-MM-dd');

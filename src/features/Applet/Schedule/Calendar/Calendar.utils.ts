import { CalendarEvent } from './Calendar.types';

export const getEventsWithOffRange = (events: CalendarEvent[], date: Date) =>
  events.map((event) => ({
    ...event,
    isOffRange: event.start.getMonth() !== date.getMonth(),
  }));

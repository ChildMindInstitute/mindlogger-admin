import { initialStateData } from 'shared/state';

import { CalendarEventsSchema } from './CalendarEvents.schema';

const visibilityStateData = {
  ...initialStateData,
  data: true,
};

export const state: CalendarEventsSchema = {
  events: initialStateData,
  alwaysAvailableVisible: visibilityStateData,
  scheduledVisible: visibilityStateData,
  createEventsData: initialStateData,
  calendarCurrentYear: initialStateData,
  processedEvents: initialStateData,
};

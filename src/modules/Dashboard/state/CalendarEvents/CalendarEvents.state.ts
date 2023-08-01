import { base } from 'shared/state';

import { CalendarEventsSchema } from './CalendarEvents.schema';

const initialStateData = {
  ...base.state,
  data: null,
};

export const state: CalendarEventsSchema = {
  events: initialStateData,
  alwaysAvailableHidden: initialStateData,
  scheduledHidden: initialStateData,
  createEventsData: initialStateData,
  calendarCurrentYear: initialStateData,
  processedEvents: initialStateData,
};

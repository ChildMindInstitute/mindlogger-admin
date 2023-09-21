import { base } from 'shared/state/Base';

import { CalendarEventsSchema } from './CalendarEvents.schema';

const initialStateData = {
  ...base.state,
  data: null,
};

const visibilityStateData = {
  ...base.state,
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

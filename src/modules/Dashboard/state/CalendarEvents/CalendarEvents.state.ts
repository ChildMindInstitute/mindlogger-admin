import { base } from 'shared/state';

import { CalendarEventsSchema } from './CalendarEvents.schema';

const initialStateData = {
  ...base.state,
  data: null,
};

export const state: CalendarEventsSchema = {
  events: initialStateData,
  eventsToShow: initialStateData,
  alwaysAvailableHidden: initialStateData,
  scheduledHidden: initialStateData,
  yearToCreateEvents: initialStateData,
  createEventsData: initialStateData,
};

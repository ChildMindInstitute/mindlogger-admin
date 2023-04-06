import { createSlice } from '@reduxjs/toolkit';

import { useAppSelector } from 'redux/store';

import { state as initialState } from './CalendarEvents.state';
import { reducers } from './CalendarEvents.reducer';
import { CalendarEventsSchema } from './CalendarEvents.schema';

export * from './CalendarEvents.schema';

const slice = createSlice({
  name: 'calendarEvents',
  initialState,
  reducers,
});

export const calendarEvents = {
  slice,
  actions: slice.actions,
  useEventsData: (): CalendarEventsSchema['events']['data'] =>
    useAppSelector(
      ({
        calendarEvents: {
          events: { data },
        },
      }) => data,
    ),
  useVisibleEventsData: (): CalendarEventsSchema['eventsToShow']['data'] =>
    useAppSelector(
      ({
        calendarEvents: {
          eventsToShow: { data },
        },
      }) => data,
    ),
};

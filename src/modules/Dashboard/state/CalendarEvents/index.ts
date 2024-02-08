import { createSlice } from '@reduxjs/toolkit';

import { useAppSelector } from 'redux/store/hooks';

import { reducers } from './CalendarEvents.reducer';
import { CalendarEventsSchema } from './CalendarEvents.schema';
import { state as initialState } from './CalendarEvents.state';

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
  useCreateEventsData: (): CalendarEventsSchema['createEventsData']['data'] =>
    useAppSelector(
      ({
        calendarEvents: {
          createEventsData: { data },
        },
      }) => data,
    ),
  useCalendarCurrentYearData: (): CalendarEventsSchema['calendarCurrentYear']['data'] =>
    useAppSelector(
      ({
        calendarEvents: {
          calendarCurrentYear: { data },
        },
      }) => data,
    ),
  useVisibleEventsData: (): CalendarEventsSchema['processedEvents']['data'] =>
    useAppSelector(
      ({
        calendarEvents: {
          processedEvents: { data },
        },
      }) => data,
    ),
  useAvailableVisibilityData: (): CalendarEventsSchema['alwaysAvailableVisible']['data'] =>
    useAppSelector(
      ({
        calendarEvents: {
          alwaysAvailableVisible: { data },
        },
      }) => data,
    ),
  useScheduledVisibilityData: (): CalendarEventsSchema['scheduledVisible']['data'] =>
    useAppSelector(
      ({
        calendarEvents: {
          scheduledVisible: { data },
        },
      }) => data,
    ),
};

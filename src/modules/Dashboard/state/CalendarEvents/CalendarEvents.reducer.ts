import { PayloadAction } from '@reduxjs/toolkit';
import { format } from 'date-fns';

import { DateFormats } from 'shared/consts';

import { CalendarEvent, CalendarEventsSchema, CreateEventsData } from './CalendarEvents.schema';
import { getNotHiddenEvents, getPreparedEvents, createEvents } from './CalendarEvents.utils';

export const reducers = {
  createCalendarEvents: (
    state: CalendarEventsSchema,
    action: PayloadAction<{
      events?: CalendarEvent[];
      alwaysAvailableHidden?: boolean;
      scheduledHidden?: boolean;
    }>,
  ): void => {
    const { events, alwaysAvailableHidden, scheduledHidden } = action.payload || {};

    if (alwaysAvailableHidden !== undefined) {
      state.alwaysAvailableHidden.data = alwaysAvailableHidden;
    }
    if (scheduledHidden !== undefined) {
      state.scheduledHidden.data = scheduledHidden;
    }

    if (events) {
      if (state.alwaysAvailableHidden.data !== null) {
        state.events.data = getPreparedEvents(events, state.alwaysAvailableHidden.data, true);
      } else if (state.scheduledHidden.data !== null) {
        state.events.data = getPreparedEvents(events, state.scheduledHidden.data, false);
      } else {
        state.events.data = events;
      }
    } else {
      if (state.alwaysAvailableHidden.data !== null && state.events.data?.length) {
        state.events.data = getPreparedEvents(
          state.events.data,
          state.alwaysAvailableHidden.data,
          true,
        );
      }
      if (state.scheduledHidden.data !== null && state.events.data?.length) {
        state.events.data = getPreparedEvents(state.events.data, state.scheduledHidden.data, false);
      }
    }

    if (state.events.data) {
      state.eventsToShow.data = getNotHiddenEvents(state.events.data);
    }
  },

  setCreateEventsData: (
    state: CalendarEventsSchema,
    action: PayloadAction<CreateEventsData[]>,
  ): void => {
    state.createEventsData.data = action.payload;
  },

  setProcessedEventStartYear: (
    state: CalendarEventsSchema,
    action: PayloadAction<{
      processedEventStartYear: number;
    }>,
  ): void => {
    state.processedEventStartYear.data = action.payload.processedEventStartYear;
  },

  createNextYearEvents: (
    state: CalendarEventsSchema,
    action: PayloadAction<{
      yearToCreateEvents: number;
    }>,
  ): void => {
    const { yearToCreateEvents } = action.payload;

    if (!(yearToCreateEvents && state.events.data)) return;

    const date = new Date(`${yearToCreateEvents}-01-01`);
    const nextYearDateString = format(date, DateFormats.YearMonthDay);
    state.events.data = [];
    state.createEventsData.data?.forEach((item) => {
      const data = {
        ...item,
        nextYearDateString,
        currentYear: yearToCreateEvents,
      };

      if (state.events.data) {
        const newEventsArr = createEvents(data);
        state.events.data = [...state.events.data, ...newEventsArr];
      }
    });

    if (state.alwaysAvailableHidden.data !== null) {
      state.events.data = getPreparedEvents(
        state.events.data,
        state.alwaysAvailableHidden.data,
        true,
      );
    }
    if (state.scheduledHidden.data !== null) {
      state.events.data = getPreparedEvents(state.events.data, state.scheduledHidden.data, false);
    }

    state.eventsToShow.data = getNotHiddenEvents(state.events.data);
  },
};

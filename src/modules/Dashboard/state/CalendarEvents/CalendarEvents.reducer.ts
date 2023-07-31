import { PayloadAction } from '@reduxjs/toolkit';
import { format } from 'date-fns';

import { DateFormats } from 'shared/consts';

import { state as initialState } from './CalendarEvents.state';
import { CalendarEvent, CalendarEventsSchema, CreateEventsData } from './CalendarEvents.schema';
import {
  getNotHiddenEvents,
  getPreparedEvents,
  createEvents,
  getEventsWithHiddenInTimeView,
} from './CalendarEvents.utils';

export const reducers = {
  resetCalendarEvents: (state: CalendarEventsSchema): void => {
    state.events = initialState.events;
    state.processedEvents = initialState.processedEvents;
    state.alwaysAvailableHidden = initialState.alwaysAvailableHidden;
    state.scheduledHidden = initialState.scheduledHidden;
    state.createEventsData = initialState.createEventsData;
    state.processedEventStartYear = initialState.processedEventStartYear;
  },

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
      state.alwaysAvailableHidden.status = 'success';
    }
    if (scheduledHidden !== undefined) {
      state.scheduledHidden.data = scheduledHidden;
      state.scheduledHidden.status = 'success';
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
      const notHiddenEvents = getNotHiddenEvents(state.events.data);
      state.processedEvents.data = getEventsWithHiddenInTimeView(notHiddenEvents);
      state.events.status = 'success';
      state.processedEvents.status = 'success';
    }
  },

  setCreateEventsData: (
    state: CalendarEventsSchema,
    action: PayloadAction<CreateEventsData[]>,
  ): void => {
    state.createEventsData.data = action.payload;
    state.createEventsData.status = 'success';
  },

  setProcessedEventStartYear: (
    state: CalendarEventsSchema,
    action: PayloadAction<{
      processedEventStartYear: number;
    }>,
  ): void => {
    state.processedEventStartYear.data = action.payload.processedEventStartYear;
    state.processedEventStartYear.status = 'success';
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

    if (state.events.data) {
      const notHiddenEvents = getNotHiddenEvents(state.events.data);
      state.processedEvents.data = getEventsWithHiddenInTimeView(notHiddenEvents);
      state.events.status = 'success';
      state.processedEvents.status = 'success';
    }
  },
};

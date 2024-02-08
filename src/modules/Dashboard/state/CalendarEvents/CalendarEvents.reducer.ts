import { PayloadAction } from '@reduxjs/toolkit';
import { format } from 'date-fns';

import { DateFormats } from 'shared/consts';

import { CalendarEvent, CalendarEventsSchema, CreateEventsData } from './CalendarEvents.schema';
import { state as initialState } from './CalendarEvents.state';
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
    state.alwaysAvailableVisible = initialState.alwaysAvailableVisible;
    state.scheduledVisible = initialState.scheduledVisible;
    state.createEventsData = initialState.createEventsData;
    state.calendarCurrentYear = initialState.calendarCurrentYear;
  },

  createCalendarEvents: (
    state: CalendarEventsSchema,
    action: PayloadAction<{
      events?: CalendarEvent[];
    } | null>,
  ): void => {
    const { events } = action.payload || {};

    if (events || state.events.data?.length) {
      state.events.data = getPreparedEvents(
        events || state.events.data || [],
        !state.alwaysAvailableVisible.data,
        !state.scheduledVisible.data,
      );
    }

    if (state.events.data) {
      const notHiddenEvents = getNotHiddenEvents(state.events.data);
      state.processedEvents.data = getEventsWithHiddenInTimeView(notHiddenEvents);
      state.events.status = 'success';
      state.processedEvents.status = 'success';
    }
  },

  setAvailableVisibility: (state: CalendarEventsSchema, action: PayloadAction<boolean>): void => {
    state.alwaysAvailableVisible.data = action.payload;
    state.alwaysAvailableVisible.status = 'success';
  },

  setScheduledVisibility: (state: CalendarEventsSchema, action: PayloadAction<boolean>): void => {
    state.scheduledVisible.data = action.payload;
    state.scheduledVisible.status = 'success';
  },

  setCreateEventsData: (state: CalendarEventsSchema, action: PayloadAction<CreateEventsData[]>): void => {
    state.createEventsData.data = action.payload;
    state.createEventsData.status = 'success';
  },

  setCalendarCurrentYear: (
    state: CalendarEventsSchema,
    action: PayloadAction<{
      calendarCurrentYear: number;
    }>,
  ): void => {
    state.calendarCurrentYear.data = action.payload.calendarCurrentYear;
    state.calendarCurrentYear.status = 'success';
  },

  createNextYearEvents: (
    state: CalendarEventsSchema,
    action: PayloadAction<{
      yearToCreateEvents: number | null;
    }>,
  ): void => {
    const { yearToCreateEvents } = action.payload;

    if (!(yearToCreateEvents && state.events.data)) return;

    const date = new Date(`${yearToCreateEvents}-01-01`);
    const nextYearDateString = format(date, DateFormats.YearMonthDay);
    state.events.data = [];
    state.createEventsData.data?.forEach(item => {
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

    state.events.data = getPreparedEvents(
      state.events.data,
      !state.alwaysAvailableVisible.data,
      !state.scheduledVisible.data,
    );

    if (state.events.data) {
      const notHiddenEvents = getNotHiddenEvents(state.events.data);
      state.processedEvents.data = getEventsWithHiddenInTimeView(notHiddenEvents);
      state.events.status = 'success';
      state.processedEvents.status = 'success';
    }
  },
};

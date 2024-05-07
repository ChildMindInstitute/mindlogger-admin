import { Dispatch, ReactElement, SetStateAction } from 'react';
import { EventWrapperProps, View } from 'react-big-calendar';

import { AllDayEventsSortedByDaysItem, CalendarEvent } from 'modules/Dashboard/state';

export type OnViewFunc = (view: View) => void;

export enum CalendarViews {
  Day = 'day',
  Week = 'week',
  Month = 'month',
  Year = 'year',
}

export type AllDayEventsVisible = {
  period: string;
  visible: boolean;
} | null;

export enum NameLength {
  Long = 'long',
  Short = 'short',
}

export type CalendarEventWrapperProps = EventWrapperProps<CalendarEvent> & {
  children: ReactElement;
};

export type GetHasWrapperMoreBtn = {
  activeView: CalendarViews;
  date: Date;
  isAllDayEventsVisible: AllDayEventsVisible;
  allDayEventsSortedByDays: AllDayEventsSortedByDaysItem[];
};

export type GetCalendarComponents = {
  activeView: CalendarViews;
  setActiveView: Dispatch<SetStateAction<CalendarViews>>;
  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;
  events: CalendarEvent[];
  setEvents: Dispatch<SetStateAction<CalendarEvent[]>>;
  isAllDayEventsVisible: AllDayEventsVisible;
  setIsAllDayEventsVisible: Dispatch<SetStateAction<AllDayEventsVisible>>;
};

export interface CalendarProps {
  userId?: string;
}

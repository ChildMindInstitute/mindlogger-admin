import { ReactElement } from 'react';
import { EventWrapperProps, View } from 'react-big-calendar';

import { CalendarEvent } from 'modules/Dashboard/state';

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

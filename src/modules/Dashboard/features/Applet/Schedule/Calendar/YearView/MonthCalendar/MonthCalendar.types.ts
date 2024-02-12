import { Dispatch, SetStateAction } from 'react';
import { CalendarProps } from 'react-big-calendar';

import { CalendarEvent } from 'modules/Dashboard/state';

import { CalendarViews } from '../../Calendar.types';

export type MonthCalendarProps = Omit<CalendarProps, 'events'> & {
  events: CalendarEvent[];
  setDate: Dispatch<SetStateAction<Date>>;
  setActiveView: Dispatch<SetStateAction<CalendarViews>>;
};

export type Week = { days: Date[]; id: string };

export type MonthObject = {
  date: Date;
  first: Date;
  last: Date;
  month?: number;
  year?: number;
  weeks: Week[];
};

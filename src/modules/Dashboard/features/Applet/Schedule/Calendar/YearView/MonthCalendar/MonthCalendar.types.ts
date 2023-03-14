import { Dispatch, SetStateAction } from 'react';
import { CalendarProps } from 'react-big-calendar';

import { CalendarViews } from '../../Calendar.types';

export type MonthCalendarProps = CalendarProps & {
  setDate: Dispatch<SetStateAction<Date>>;
  setActiveView: Dispatch<SetStateAction<CalendarViews>>;
};

export type Week = Date[];

export type MonthObject = {
  date: Date;
  first: Date;
  last: Date;
  month?: number;
  year?: number;
  weeks: Week[];
};

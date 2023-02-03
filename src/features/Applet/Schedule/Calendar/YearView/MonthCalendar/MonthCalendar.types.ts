import { Dispatch, SetStateAction } from 'react';
import { CalendarProps } from 'react-big-calendar';

export type MonthCalendarProps = CalendarProps & {
  setDate: Dispatch<SetStateAction<Date>>;
  setActiveView: Dispatch<SetStateAction<string>>;
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

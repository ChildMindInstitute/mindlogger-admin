import { CalendarEvent } from 'modules/Dashboard/state';

export type CalendarDateProps = {
  dateToRender: Date;
  dateOfMonth: Date;
  onDayClick: (date: Date) => void;
  events: CalendarEvent[];
};

export type TooltipPosition = 'bottom' | 'top' | null;

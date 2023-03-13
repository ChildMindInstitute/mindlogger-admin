import { CalendarEvent } from 'modules/Dashboard/features/Applet/Schedule/Calendar/Calendar.types';

export type CalendarDateProps = {
  dateToRender: Date;
  dateOfMonth: Date;
  onDayClick: (date: Date) => void;
  events: CalendarEvent[];
};

export type TooltipPosition = 'bottom' | 'top' | null;

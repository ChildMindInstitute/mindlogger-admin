import { CalendarEvent } from '../../../Calendar.types';

export type CalendarDateProps = {
  dateToRender: Date;
  dateOfMonth: Date;
  onClick: (date: Date) => void;
  events: CalendarEvent[];
};

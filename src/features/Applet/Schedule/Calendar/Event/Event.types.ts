import { CalendarEvent } from '../Calendar.types';

export enum UiType {
  MonthView = 'monthView',
  TimeView = 'timeView',
}

export type EventProps = { title: string; event: CalendarEvent; uiType?: UiType };

import { CalendarEvent } from '../Calendar.types';

export enum UiType {
  DefaultView = 'defaultView',
  TimeView = 'timeView',
}

export type EventProps = { title: string; event: CalendarEvent; uiType?: UiType };

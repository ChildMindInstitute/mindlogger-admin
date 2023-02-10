import { CalendarEvent } from '../Calendar.types';

export enum UiType {
  Primary = 'primary',
  Secondary = 'secondary',
}

export type EventProps = { title: string; event: CalendarEvent; uiType?: UiType };

import { CalendarEvent } from 'modules/Dashboard/state';

export enum UiType {
  DefaultView = 'defaultView',
  TimeView = 'timeView',
}

export type EventProps = { title: string; event: CalendarEvent; uiType?: UiType };

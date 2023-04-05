import { CalendarProps } from 'react-big-calendar';

import { CalendarEvent } from 'modules/Dashboard/state';

import { CalendarViews } from '../Calendar.types';

export type EventContainerWrapperProps = Partial<CalendarProps> & {
  events: CalendarEvent[];
  components?: CalendarProps['components'] & {
    activeView?: CalendarViews;
  };
};

export type EventStartEndDates = {
  id: string;
  start: string;
  end: string;
};

export type EventInterval = {
  intervalStart: number;
  intervalEnd: number;
  eventIds: string[];
};

export type EventsStartEndDates = EventStartEndDates[];

export type OverlappingEventsArgs = { eventsArr: EventStartEndDates[]; maxEventsQuantity: number };

export enum EventsWidthBreakpoints {
  Lg = 119,
  Md = 71,
  Sm = 47,
}

export enum EventsHeightBreakpoints {
  Md = 40,
  Sm = 30,
}

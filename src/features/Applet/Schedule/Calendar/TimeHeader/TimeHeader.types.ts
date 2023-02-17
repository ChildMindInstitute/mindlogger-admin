import { Dispatch, SetStateAction } from 'react';
import { HeaderProps } from 'react-big-calendar';

import { AllDayEventsVisible, CalendarEvent } from '../Calendar.types';

export enum UiType {
  Day = 'day',
  Week = 'week',
}

export type TimeHeaderProps = HeaderProps & {
  uiType: UiType;
  setEvents: Dispatch<SetStateAction<CalendarEvent[]>>;
  isAllDayEventsVisible: AllDayEventsVisible;
  setIsAllDayEventsVisible: Dispatch<SetStateAction<AllDayEventsVisible>>;
};

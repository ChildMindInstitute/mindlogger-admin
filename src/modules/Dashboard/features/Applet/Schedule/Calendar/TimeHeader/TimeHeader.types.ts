import { Dispatch, SetStateAction } from 'react';

import { HeaderProps } from 'react-big-calendar';

import { CalendarEvent } from 'modules/Dashboard/state';

import { AllDayEventsVisible } from '../Calendar.types';

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

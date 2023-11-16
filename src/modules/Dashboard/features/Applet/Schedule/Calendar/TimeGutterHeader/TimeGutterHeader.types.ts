import { Dispatch, SetStateAction } from 'react';

import { CalendarEvent } from 'modules/Dashboard/state';

import { AllDayEventsVisible, CalendarViews } from '../Calendar.types';

export type TimeGutterHeaderProps = {
  date: Date;
  setEvents: Dispatch<SetStateAction<CalendarEvent[]>>;
  isAllDayEventsVisible: AllDayEventsVisible;
  setIsAllDayEventsVisible: Dispatch<SetStateAction<AllDayEventsVisible>>;
  activeView: CalendarViews;
};

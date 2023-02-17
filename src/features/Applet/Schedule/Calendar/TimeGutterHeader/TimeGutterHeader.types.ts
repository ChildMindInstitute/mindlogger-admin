import { Dispatch, SetStateAction } from 'react';

import { AllDayEventsVisible, CalendarEvent, CalendarViews } from '../Calendar.types';

export type TimeGutterHeaderProps = {
  date: Date;
  setEvents: Dispatch<SetStateAction<CalendarEvent[]>>;
  isAllDayEventsVisible: AllDayEventsVisible;
  setIsAllDayEventsVisible: Dispatch<SetStateAction<AllDayEventsVisible>>;
  activeView: CalendarViews;
};

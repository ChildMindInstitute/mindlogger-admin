import { Dispatch, ReactElement, SetStateAction } from 'react';
import { CalendarProps, EventWrapperProps as CalendarEventWrapperProps } from 'react-big-calendar';

import { AllDayEventsVisible, CalendarEvent } from '../Calendar.types';

export type EventWrapperProps = CalendarEventWrapperProps<CalendarEvent> & {
  children: ReactElement;
  components: CalendarProps['components'] & {
    isAllDayEventsVisible: AllDayEventsVisible;
    setEditActivityPopupVisible: Dispatch<SetStateAction<boolean>>;
  };
};

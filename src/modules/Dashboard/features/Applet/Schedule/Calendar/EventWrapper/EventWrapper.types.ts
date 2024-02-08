import { Dispatch, SetStateAction } from 'react';

import { CalendarProps } from 'react-big-calendar';

import { AllDayEventsVisible, CalendarEventWrapperProps } from '../Calendar.types';

export enum UiType {
  TimeView = 'timeView',
  MonthView = 'monthView',
}

export type EventWrapperProps = CalendarEventWrapperProps & {
  components?: CalendarProps['components'] & {
    isAllDayEventsVisible: AllDayEventsVisible;
    setEditActivityPopupVisible: Dispatch<SetStateAction<boolean>>;
  };
  uiType?: UiType;
};

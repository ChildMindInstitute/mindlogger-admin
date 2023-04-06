import { EventProps } from 'react-big-calendar';

import { CalendarEvent } from 'modules/Dashboard/state';

import { UiType } from '../Event';
import { CalendarViews } from '../Calendar.types';

export type MonthWeekEventProps = EventProps<CalendarEvent> & {
  uiType?: UiType;
  activeView?: CalendarViews;
};

export type StyledEventWrapperTypes = {
  isScheduledWeekEvent: boolean;
  eventsNumber: number;
  bgColor: string;
  borderRadius: string;
  borderWidth: string;
  borderColor: string;
};

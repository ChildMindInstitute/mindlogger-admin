import { Dispatch, SetStateAction } from 'react';
import { ToolbarProps as CalendarToolbarProps } from 'react-big-calendar';

import { CalendarView } from '../Calendar.types';

export type ToolbarProps = CalendarToolbarProps & {
  activeView: string;
  setActiveView: Dispatch<SetStateAction<CalendarView>>;
};

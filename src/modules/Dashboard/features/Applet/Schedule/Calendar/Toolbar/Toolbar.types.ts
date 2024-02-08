import { Dispatch, SetStateAction } from 'react';

import { ToolbarProps as CalendarToolbarProps } from 'react-big-calendar';

import { CalendarViews } from '../Calendar.types';

export type ToolbarProps = CalendarToolbarProps & {
  activeView: string;
  setActiveView: Dispatch<SetStateAction<CalendarViews>>;
};

export type SetActiveBtnFunc = (value: string | number) => void;

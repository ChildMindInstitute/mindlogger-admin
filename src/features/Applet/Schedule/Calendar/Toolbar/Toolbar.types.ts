import { Dispatch, SetStateAction } from 'react';
import { ToolbarProps as CalendarToolbarProps } from 'react-big-calendar';

export type ToolbarProps = CalendarToolbarProps & {
  activeView: string;
  setActiveView: Dispatch<SetStateAction<string>>;
};

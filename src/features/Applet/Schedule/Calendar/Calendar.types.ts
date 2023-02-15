import { View } from 'react-big-calendar';

export type CalendarEvent = {
  id: string;
  resourceId: string;
  title: string;
  start: Date;
  end: Date;
  backgroundColor: string;
  alwaysAvailable: boolean;
  isHidden: boolean;
  isHiddenInTimeView?: boolean;
  scheduledColor?: string;
  scheduledBackground?: string;
  allDayEvent?: boolean;
  startFlowIcon?: boolean;
  endAlertIcon?: boolean;
  isOffRange?: boolean;
};

export type OnViewFunc = (view: View) => void;

export enum CalendarViews {
  Day = 'day',
  Week = 'week',
  Month = 'month',
  Year = 'year',
}

export type AllDayEventsVisible = {
  period: string | undefined;
  visible: boolean;
} | null;

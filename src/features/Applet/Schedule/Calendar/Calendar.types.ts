import { View } from 'react-big-calendar';

export type CalendarEvent = {
  title: string;
  start: Date;
  end: Date;
  id: string;
  backgroundColor: string;
  alwaysAvailable: boolean;
  isHidden: boolean;
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

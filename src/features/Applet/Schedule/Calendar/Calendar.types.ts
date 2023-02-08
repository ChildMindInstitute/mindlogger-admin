import { View } from 'react-big-calendar';

export type CalendarEvent = {
  title: string;
  start: Date;
  end: Date;
  id: string;
  backgroundColor: string;
  alwaysAvailable: boolean;
  startIndicator?: string;
  startTime?: string;
  startFlowIcon?: boolean;
  endAlertIcon?: boolean;
  isHidden?: boolean;
  isOffRange?: boolean;
};

export type OnViewFunc = (view: View) => void;

export enum CalendarViews {
  Day = 'day',
  Week = 'week',
  Month = 'month',
  Year = 'year',
}

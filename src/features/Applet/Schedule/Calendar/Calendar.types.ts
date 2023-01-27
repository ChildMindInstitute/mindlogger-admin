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

export const enum CalendarView {
  day = 'day',
  week = 'week',
  month = 'month',
  year = 'year',
}

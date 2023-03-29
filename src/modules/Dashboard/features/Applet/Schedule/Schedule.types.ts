import { Row } from 'shared/components';

export type LegendEvent = {
  name: string;
  id: string;
  isFlow: boolean;
  count?: number;
  colors?: string[];
};

export enum Repeats {
  Yes = 'yes',
  No = 'no',
}

export type ScheduleExportCsv = {
  activityName: string;
  date: string;
  startTime: string;
  endTime: string;
  notificationTime: string;
  repeats: Repeats;
  frequency: string;
}[];

export type PreparedEvents = {
  alwaysAvailableEvents: LegendEvent[];
  scheduledEvents: LegendEvent[];
  deactivatedEvents: LegendEvent[];
  scheduleExportTableData: Row[];
  scheduleExportCsv: ScheduleExportCsv;
};

export type AddEventsToCategories = Omit<LegendEvent, 'count'> & {
  isHidden?: boolean;
  index: number;
};

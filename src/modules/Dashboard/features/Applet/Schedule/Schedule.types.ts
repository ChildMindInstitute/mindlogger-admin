import { Row } from 'shared/components';
import { CalendarEvent, CreateEventsData } from 'modules/Dashboard/state';

export type LegendEvent = {
  name: string;
  id: string;
  isFlow: boolean;
  count?: number;
  colors?: string[];
};

export type ScheduleExportItem = {
  activityName: string;
  date: string;
  startTime: string;
  endTime: string;
  notificationTime: string;
  frequency: string;
};

export type ScheduleExportCsv = ScheduleExportItem[];

export type PreparedEvents = {
  alwaysAvailableEvents: LegendEvent[];
  scheduledEvents: LegendEvent[];
  deactivatedEvents: LegendEvent[];
  scheduleExportTableData: Row[];
  scheduleExportCsv: ScheduleExportCsv;
};

export type AddEventsToCategories = Omit<LegendEvent, 'count'> & {
  isHidden?: boolean;
};

export type ActivitiesFlowsWithColors = {
  color: string[];
  id: string;
}[];

export type EventsData = {
  scheduleExportTableData: Row[];
  scheduleExportCsv: ScheduleExportCsv;
  scheduledActivitiesFlows: ActivitiesFlowsWithColors;
  alwaysActivitiesFlows: ActivitiesFlowsWithColors;
  calendarEventsArr: CalendarEvent[];
  eventsDataArr: CreateEventsData[];
};

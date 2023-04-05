import { Periodicity } from 'modules/Dashboard/api';
import { BaseSchema } from 'shared/state';

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
  allDay?: boolean;
  startFlowIcon?: boolean;
  endAlertIcon?: boolean;
  isOffRange?: boolean;
  eventSpanBefore?: boolean;
  eventSpanAfter?: boolean;
};

export type CreateEventsData = {
  activityOrFlowId: string;
  activityOrFlowName: string;
  periodicityType: Periodicity;
  selectedDate: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  isAlwaysAvailable: boolean;
  colors: string[];
  flowId?: string;
  nextYearDateString: string | null;
  currentYear: number;
};

export type CalendarEventsSchema = {
  events: BaseSchema<CalendarEvent[] | null>;
  eventsToShow: BaseSchema<CalendarEvent[] | null>;
  alwaysAvailableHidden: BaseSchema<boolean | null>;
  scheduledHidden: BaseSchema<boolean | null>;
  yearToCreateEvents: BaseSchema<number | null>;
  createEventsData: BaseSchema<CreateEventsData[] | null>;
};

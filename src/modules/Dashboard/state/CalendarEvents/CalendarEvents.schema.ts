import { Periodicity } from 'modules/Dashboard/api';
import { BaseSchema } from 'shared/state';
import { Event } from 'modules/Dashboard/state';

export type CalendarEvent = {
  id: string;
  activityOrFlowId: string;
  eventId: string;
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
  periodicity: Periodicity;
  eventStart: Date;
  eventEnd: Date | null;
  eventCurrentDate?: string;
} & Pick<
  Event,
  'oneTimeCompletion' | 'accessBeforeSchedule' | 'timerType' | 'timer' | 'notification'
>;

export type CreateEventsData = {
  activityOrFlowId: string;
  eventId: string;
  activityOrFlowName: string;
  periodicityType: Periodicity;
  selectedDate: string | null;
  startDate: string | null;
  endDate: string | null;
  isAlwaysAvailable: boolean;
  colors: string[];
  nextYearDateString: string | null;
  currentYear: number;
} & Pick<
  Event,
  | 'flowId'
  | 'startTime'
  | 'endTime'
  | 'oneTimeCompletion'
  | 'accessBeforeSchedule'
  | 'timerType'
  | 'timer'
  | 'notification'
>;

export type AllDayEventsSortedByDaysItem = {
  date: string;
  week: string;
  eventsIds: { id: string; isHiddenInTimeView: boolean }[];
};

export type GetDaysInMonthlyPeriodicity = {
  chosenDate: number;
  eventEnd: Date;
  eventStart: Date;
  returnStringDate?: boolean;
};

export type CalendarEventsSchema = {
  events: BaseSchema<CalendarEvent[] | null>;
  alwaysAvailableVisible: BaseSchema<boolean>;
  scheduledVisible: BaseSchema<boolean>;
  createEventsData: BaseSchema<CreateEventsData[] | null>;
  calendarCurrentYear: BaseSchema<number | null>;
  processedEvents: BaseSchema<{
    eventsToShow: CalendarEvent[] | null;
    allDayEventsSortedByDays: AllDayEventsSortedByDaysItem[] | null;
    hiddenEventsIds: string[] | null;
  } | null>;
};

import { EventNotifications, EventReminder, Periodicity, TimerType } from 'api';
import { BaseSchema } from 'shared/state/Base';

export type Event = {
  accessBeforeSchedule: boolean | null;
  activityId: string | null;
  endTime: string | null;
  flowId: string | null;
  id: string;
  notification: {
    notifications: EventNotifications;
    reminder: EventReminder;
  } | null;
  oneTimeCompletion: boolean | null;
  periodicity: {
    type: Periodicity;
    startDate: string | null;
    endDate: string | null;
    selectedDate: string | null;
  };
  respondentId: string | null;
  startTime: string | null;
  timer: number | null;
  timerType: TimerType;
};

export type AppletsSchema = {
  events: BaseSchema<{ result: Event[]; count: number } | null>;
};

import { BaseSchema } from 'shared/state/Base';
import { Periodicity, TimerType, EventNotifications, EventReminder } from 'api';

export type Event = {
  startTime: string | null;
  endTime: string | null;
  accessBeforeSchedule: boolean | null;
  oneTimeCompletion: boolean | null;
  timer: number | null;
  timerType: TimerType;
  id: string;
  periodicity: {
    type: Periodicity;
    startDate: string | null;
    endDate: string | null;
    selectedDate: string | null;
  };
  respondentId: string | null;
  activityId: string | null;
  flowId: string | null;
  notification: {
    notifications: EventNotifications;
    reminder: EventReminder;
  } | null;
};

export type AppletsSchema = {
  events: BaseSchema<{ result: Event[]; count: number } | null>;
};

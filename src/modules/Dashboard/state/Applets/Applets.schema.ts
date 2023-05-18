import { ActionReducerMapBuilder, AsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';

import { BaseSchema } from 'shared/state/Base';
import { AppletId, Periodicity, TimerType, EventNotifications, EventReminder } from 'api';

export type CreateAppletsStateData = {
  builder: ActionReducerMapBuilder<AppletsSchema>;
  thunk: AsyncThunk<AxiosResponse, AppletId, Record<string, never>>;
  key: keyof AppletsSchema;
};

export type Event = {
  startTime: string;
  endTime: string;
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

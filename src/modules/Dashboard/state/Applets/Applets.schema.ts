import { ActionReducerMapBuilder, AsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';

import { BaseSchema } from 'shared/state/Base';
import {
  AppletId,
  GetAppletsParams,
  Periodicity,
  TimerType,
  EventNotifications,
  EventReminder,
} from 'api';
import { Encryption } from 'shared/utils';

export type CreateAppletsStateData = {
  builder: ActionReducerMapBuilder<AppletsSchema>;
  thunk:
    | AsyncThunk<AxiosResponse, GetAppletsParams, Record<string, never>>
    | AsyncThunk<AxiosResponse, AppletId, Record<string, never>>;
  key: keyof AppletsSchema;
};

export type Applet = {
  id: string;
  displayName: string;
  version: string;
  description: string;
  about: string;
  image: string;
  watermark: string;
  themeId: string;
  reportServerIp: string;
  reportPublicKey: string;
  reportRecipients: string[];
  reportIncludeUserId: boolean;
  reportIncludeCaseId: boolean;
  reportEmailBody: string;
  createdAt: string;
  updatedAt: string;
  encryption?: Encryption | null;
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
  applets: BaseSchema<{ result: Applet[]; count: number } | null>;
  events: BaseSchema<{ result: Event[]; count: number } | null>;
};

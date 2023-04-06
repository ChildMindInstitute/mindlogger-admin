import { ActionReducerMapBuilder, AsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';

import { BaseSchema } from 'shared/state/Base';
import { AppletId, GetAppletsParams, Periodicity, TimerType } from 'api';

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
};

export type Event = {
  startTime: string;
  endTime: string;
  accessBeforeSchedule: boolean;
  oneTimeCompletion: boolean;
  timer: string;
  timerType: TimerType;
  id: string;
  periodicity: {
    type: Periodicity;
    startDate: string;
    endDate: string;
    selectedDate: string;
  };
  respondentId: string;
  activityId: string;
  flowId: string;
};

export type AppletsSchema = {
  applets: BaseSchema<{ result: Applet[]; count: number } | null>;
  events: BaseSchema<{ result: Event[]; count: number } | null>;
};

import { ActionReducerMapBuilder, AsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';

import { GetAppletsParams } from 'api';
import { BaseSchema } from 'shared/state/Base';
import { Roles } from 'shared/consts';

export type RespondentDetail = {
  appletId: string;
  appletDisplayName: string;
  accessId: string;
  respondentNickname: string;
  respondentSecretId: string;
  hasIndividualSchedule: boolean;
  appletImg?: string;
};

export type Respondent = {
  id: string;
  accessId: string;
  nicknames: string[];
  role: Roles;
  secretIds: string[];
  lastSeen: string;
  isPinned?: boolean;
  details: RespondentDetail[];
};

export type Manager = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: Roles[];
  lastSeen: string;
  isPinned?: boolean;
  details: {
    appletId: string;
    appletDisplayName: string;
    accessId: string;
    role: Roles;
  }[];
};

export type UsersSchema = {
  respondents: BaseSchema<{ result: Respondent[]; count: number } | null>;
  allRespondents: BaseSchema<{ result: Respondent[]; count: number } | null>;
  managers: BaseSchema<{ result: Manager[]; count: number } | null>;
};

export type CreateUsersStateData = {
  builder: ActionReducerMapBuilder<UsersSchema>;
  thunk: AsyncThunk<AxiosResponse, GetAppletsParams, Record<string, never>>;
  key: keyof UsersSchema;
};

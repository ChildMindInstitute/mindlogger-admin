import { ActionReducerMapBuilder, AsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';

import { GetAppletsParams } from 'api';
import { BaseSchema } from 'shared/state/Base';
import { Roles } from 'shared/consts';

export type Respondent = {
  id: string;
  accessId: string;
  nickname: string | null;
  role: Roles;
  secretId: string;
  lastSeen: string;
  hasIndividualSchedule: boolean;
  isPinned?: boolean;
};

export type Manager = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: Roles[];
  lastSeen: string;
};

export type UsersSchema = {
  respondents: BaseSchema<{ result: Respondent[]; count: number } | null>;
  managers: BaseSchema<{ result: Manager[]; count: number } | null>;
};

export type CreateUsersStateData = {
  builder: ActionReducerMapBuilder<UsersSchema>;
  thunk: AsyncThunk<AxiosResponse, GetAppletsParams, Record<string, never>>;
  key: keyof UsersSchema;
};

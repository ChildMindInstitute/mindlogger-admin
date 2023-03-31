import { ActionReducerMapBuilder, AsyncThunk } from '@reduxjs/toolkit';
import { GetAppletsParams } from 'api';
import { AxiosResponse } from 'axios';

import { BaseSchema } from 'shared/state/Base';

export type Respondent = {
  id: string;
  nickname: string;
  roles: string[];
  secretId: string;
  lastSeen: string;
};

export type Manager = {
  id: string;
  firstName: string;
  lastName: string;
  roles: string[];
  email: string;
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

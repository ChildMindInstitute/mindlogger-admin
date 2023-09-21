import { createSlice } from '@reduxjs/toolkit';

import { useAppSelector } from 'redux/store/hooks';
import { Respondent } from 'modules/Dashboard/types';

import * as thunk from './Users.thunk';
import { state as initialState } from './Users.state';
import { extraReducers } from './Users.reducer';
import { UsersSchema } from './Users.schema';

export * from './Users.schema';

const slice = createSlice({
  name: 'users',
  initialState,
  extraReducers,
  reducers: {},
});

export const users = {
  thunk,
  slice,
  actions: slice.actions,
  useAllRespondentsData: (): UsersSchema['allRespondents']['data'] =>
    useAppSelector(
      ({
        users: {
          allRespondents: { data },
        },
      }) => data,
    ),
  useAllRespondentsStatus: (): UsersSchema['allRespondents']['status'] =>
    useAppSelector(
      ({
        users: {
          allRespondents: { status },
        },
      }) => status,
    ),
  useRespondent: (id: string): Respondent | undefined =>
    useAppSelector(
      ({
        users: {
          allRespondents: { data },
        },
      }) => data?.result.find((respondent: Respondent) => respondent.id === id),
    ),
};

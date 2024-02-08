import { createSlice } from '@reduxjs/toolkit';

import { useAppSelector } from 'redux/store/hooks';

import { extraReducers } from './Users.reducer';
import { UsersSchema } from './Users.schema';
import { state as initialState } from './Users.state';
import * as thunk from './Users.thunk';

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
  useRespondent: (): UsersSchema['respondentDetails']['data'] | undefined =>
    useAppSelector(
      ({
        users: {
          respondentDetails: { data },
        },
      }) => data,
    ),
};

import { createSlice } from '@reduxjs/toolkit';

import { useAppSelector } from 'redux/store';

import * as thunk from './Users.thunk';
import { state as initialState } from './Users.state';
import { extraReducers } from './Users.reducer';
import { UsersSchema } from './Users.schema';

export * from './Users.schema';

const slice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers,
});

export const users = {
  thunk,
  slice,
  useManagersData: (): UsersSchema['managers']['data'] =>
    useAppSelector(
      ({
        users: {
          managers: { data },
        },
      }) => data,
    ),
  useRespondentsData: (): UsersSchema['respondents']['data'] =>
    useAppSelector(
      ({
        users: {
          respondents: { data },
        },
      }) => data,
    ),
  useRespondentsMetaStatus: (): UsersSchema['respondents']['status'] =>
    useAppSelector(
      ({
        users: {
          respondents: { status },
        },
      }) => status,
    ),
};

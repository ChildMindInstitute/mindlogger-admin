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
  useManagerData: (): UsersSchema['manager']['data'] =>
    useAppSelector(
      ({
        users: {
          manager: { data },
        },
      }) => data,
    ),
  useUserData: (): UsersSchema['user']['data'] =>
    useAppSelector(
      ({
        users: {
          user: { data },
        },
      }) => data,
    ),
};

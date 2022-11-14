import { createSlice } from '@reduxjs/toolkit';

import { useAppSelector } from 'redux/store';

import * as thunk from './Auth.thunk';
import { state as initialState } from './Auth.state';
import { reducers, extraReducers } from './Auth.reducer';
import { AuthSchema, User } from './Auth.schema';

export * from './Auth.schema';

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers,
  extraReducers,
});

export const auth = {
  thunk,
  slice,
  actions: slice.actions,
  useAuthorized: (): AuthSchema['isAuthorized'] =>
    useAppSelector(({ auth: { isAuthorized } }) => isAuthorized),
  useUserData: (): User =>
    useAppSelector(
      ({
        auth: {
          authentication: {
            data: { user },
          },
        },
      }) => user,
    ),
};

import { createSlice } from '@reduxjs/toolkit';

import { useAppSelector } from 'redux/store';

import * as thunk from './Auth.thunk';
import { state as initialState } from './Auth.state';
import { extraReducers } from './Auth.reducer';
import { AuthData } from './Auth.schema';

export * from './Auth.schema';

export const auth = {
  thunk,
  slice: createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers,
  }),
  useData: (): AuthData =>
    useAppSelector(
      ({
        auth: {
          authentication: { data },
        },
      }) => data,
    ),
};

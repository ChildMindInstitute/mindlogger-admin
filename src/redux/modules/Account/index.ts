import { createSlice } from '@reduxjs/toolkit';

import { useAppSelector } from 'redux/store';

import * as thunk from './Account.thunk';
import { state as initialState } from './Account.state';
import { extraReducers } from './Account.reducer';
import { AccountSchema } from './Account.schema';

export * from './Account.schema';

const slice = createSlice({
  name: 'account',
  initialState,
  reducers: {},
  extraReducers,
});

export const account = {
  thunk,
  slice,
  useData: (): AccountSchema['switchAccount']['data'] =>
    useAppSelector(
      ({
        account: {
          switchAccount: { data },
        },
      }) => data,
    ),
  useFoldersApplets: (): AccountSchema['accountFoldersApplets']['data'] =>
    useAppSelector(
      ({
        account: {
          accountFoldersApplets: { data },
        },
      }) => data,
    ),
};

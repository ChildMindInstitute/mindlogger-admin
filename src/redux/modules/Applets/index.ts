import { createSlice } from '@reduxjs/toolkit';

import { useAppSelector } from 'redux/store';

import * as thunk from './Applets.thunk';
import { state as initialState } from './Applets.state';
import { extraReducers } from './Applets.reducer';
import { AppletsSchema } from './Applets.schema';

export * from './Applets.schema';

const slice = createSlice({
  name: 'applets',
  initialState,
  reducers: {},
  extraReducers,
});

export const applets = {
  thunk,
  slice,
  useAppletsData: (): AppletsSchema['applets']['data'] =>
    useAppSelector(
      ({
        account: {
          applets: { data },
        },
      }) => data,
    ),
};

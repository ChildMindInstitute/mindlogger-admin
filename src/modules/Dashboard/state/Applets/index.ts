import { createSlice } from '@reduxjs/toolkit';

import { useAppSelector } from 'redux/store/hooks';

import { extraReducers, reducers } from './Applets.reducer';
import { AppletsSchema } from './Applets.schema';
import { state as initialState } from './Applets.state';
import * as thunk from './Applets.thunk';

export * from './Applets.schema';

const slice = createSlice({
  name: 'applets',
  initialState,
  reducers,
  extraReducers,
});

export const applets = {
  thunk,
  slice,
  actions: slice.actions,
  useEventsData: (): AppletsSchema['events']['data'] =>
    useAppSelector(
      ({
        applets: {
          events: { data },
        },
      }) => data,
    ),
};

import { createSlice } from '@reduxjs/toolkit';

import { useAppSelector } from 'redux/store';

import * as thunk from './Applets.thunk';
import { state as initialState } from './Applets.state';
import { extraReducers, reducers } from './Applets.reducer';
import { AppletsSchema } from './Applets.schema';

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
  useData: (): AppletsSchema['applets']['data'] =>
    useAppSelector(
      ({
        applets: {
          applets: { data },
        },
      }) => data,
    ),
  useStatus: (): AppletsSchema['applets']['status'] =>
    useAppSelector(
      ({
        applets: {
          applets: { status },
        },
      }) => status,
    ),
};

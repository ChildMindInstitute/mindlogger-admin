import { createSlice } from '@reduxjs/toolkit';

import { useAppSelector } from 'redux/store';

import * as thunk from './Applet.thunk';
import { state as initialState } from './Applet.state';
import { extraReducers } from './Applet.reducer';
import { AppletSchema } from './Applet.schema';

export * from './Applet.schema';

const slice = createSlice({
  name: 'applet',
  initialState,
  reducers: {},
  extraReducers,
});

export const applet = {
  thunk,
  slice,
  actions: slice.actions,
  useAppletData: (): AppletSchema['applet']['data'] =>
    useAppSelector(
      ({
        applet: {
          applet: { data },
        },
      }) => data,
    ),
  useAppletStatus: (): AppletSchema['applet']['status'] =>
    useAppSelector(
      ({
        applet: {
          applet: { status },
        },
      }) => status,
    ),
};

import { createSlice } from '@reduxjs/toolkit';

import { useAppSelector } from 'redux/store';
import { MetaStatus } from 'shared/state/Base';

import * as thunk from './Applet.thunk';
import { state as initialState } from './Applet.state';
import { extraReducers } from './Applet.reducer';
import { AppletSchema } from './Applet.schema';
import { removeApplet, updateReportConfig } from './Applet.utils';

export * from './Applet.schema';

const slice = createSlice({
  name: 'applet',
  initialState,
  reducers: { removeApplet, updateReportConfig },
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
  useResponseStatus: (): MetaStatus =>
    useAppSelector(
      ({
        applet: {
          applet: { status },
        },
      }) => status,
    ),
  useResponseTypePrefix: (): string =>
    useAppSelector(
      ({
        applet: {
          applet: { typePrefix },
        },
      }) => typePrefix,
    ),
};

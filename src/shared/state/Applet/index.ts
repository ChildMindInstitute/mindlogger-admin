import { createSlice } from '@reduxjs/toolkit';

import { useAppSelector } from 'redux/store/hooks';
import { MetaSchema } from 'shared/state/Base';

import * as thunk from './Applet.thunk';
import { state as initialState } from './Applet.state';
import { extraReducers } from './Applet.reducer';
import { AppletSchema } from './Applet.schema';
import { removeApplet, updateAppletData, resetApplet } from './Applet.utils';

export * from './Applet.schema';

const slice = createSlice({
  name: 'applet',
  initialState,
  reducers: {
    removeApplet,
    updateAppletData,
    resetApplet,
  },
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
  useResponseStatus: (): MetaSchema['status'] =>
    useAppSelector(
      ({
        applet: {
          applet: { status },
        },
      }) => status,
    ),
  useResponseTypePrefix: (): MetaSchema['typePrefix'] =>
    useAppSelector(
      ({
        applet: {
          applet: { typePrefix },
        },
      }) => typePrefix,
    ),
  useResponseError: (): MetaSchema['error'] =>
    useAppSelector(
      ({
        applet: {
          applet: { error },
        },
      }) => error,
    ),
};

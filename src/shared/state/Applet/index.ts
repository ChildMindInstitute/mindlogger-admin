import { createSlice } from '@reduxjs/toolkit';

import { useAppSelector } from 'redux/store/hooks';
import { MetaSchema } from 'shared/state/Base';

import { extraReducers } from './Applet.reducer';
import { AppletSchema } from './Applet.schema';
import { state as initialState } from './Applet.state';
import * as thunk from './Applet.thunk';
import { removeApplet, resetApplet, updateAppletData } from './Applet.utils';

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
  useActivityDataFromApplet: (currentActivityId: string) =>
    useAppSelector(
      ({
        applet: {
          applet: { data },
        },
      }) => {
        const activity = data?.result?.activities?.find(({ id }) => id === currentActivityId);

        if (!Array.isArray(activity?.items)) {
          return [];
        }

        return activity?.items;
      },
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

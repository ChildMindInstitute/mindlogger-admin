import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { getFulfilledData, getPendingData, getRejectedData } from 'shared/utils/state';

import { AppletSchema } from './Applet.schema';
import { createApplet, getApplet, getAppletWithItems, updateApplet } from './Applet.thunk';
import { state as initialState } from './Applet.state';

export const extraReducers = (builder: ActionReducerMapBuilder<AppletSchema>): void => {
  getPendingData({ builder, thunk: getApplet, key: 'applet' });
  getFulfilledData({ builder, thunk: getApplet, key: 'applet', initialState });
  getRejectedData({ builder, thunk: getApplet, key: 'applet', initialState });

  getPendingData({ builder, thunk: getAppletWithItems, key: 'applet' });
  getFulfilledData({ builder, thunk: getAppletWithItems, key: 'applet', initialState });
  getRejectedData({ builder, thunk: getAppletWithItems, key: 'applet', initialState });

  getPendingData({ builder, thunk: createApplet, key: 'applet' });
  getFulfilledData({ builder, thunk: createApplet, key: 'applet', initialState });
  getRejectedData({ builder, thunk: createApplet, key: 'applet', initialState });

  getPendingData({ builder, thunk: updateApplet, key: 'applet' });
  getFulfilledData({ builder, thunk: updateApplet, key: 'applet', initialState });
  getRejectedData({ builder, thunk: updateApplet, key: 'applet', initialState });
};

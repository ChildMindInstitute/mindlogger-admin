import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { AppletSchema } from './Applet.schema';
import { getApplet } from './Applet.thunk';

import {
  createAppletPendingData,
  createAppletFulfilledData,
  createAppletRejectedData,
} from './Applet.utils';

export const extraReducers = (builder: ActionReducerMapBuilder<AppletSchema>): void => {
  createAppletPendingData({ builder, thunk: getApplet, key: 'applet' });
  createAppletFulfilledData({ builder, thunk: getApplet, key: 'applet' });
  createAppletRejectedData({ builder, thunk: getApplet, key: 'applet' });
};

import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { AppletSchema } from './Applet.schema';
import { createApplet, getApplet, updateApplet } from './Applet.thunk';

import {
  createAppletPendingData,
  createAppletFulfilledData,
  createAppletRejectedData,
} from './Applet.utils';

export const extraReducers = (builder: ActionReducerMapBuilder<AppletSchema>): void => {
  createAppletPendingData({ builder, thunk: getApplet, key: 'applet' });
  createAppletFulfilledData({ builder, thunk: getApplet, key: 'applet' });
  createAppletRejectedData({ builder, thunk: getApplet, key: 'applet' });

  createAppletPendingData({ builder, thunk: createApplet, key: 'applet' });
  createAppletFulfilledData({ builder, thunk: createApplet, key: 'applet' });
  createAppletRejectedData({ builder, thunk: createApplet, key: 'applet' });

  createAppletPendingData({ builder, thunk: updateApplet, key: 'applet' });
  createAppletFulfilledData({ builder, thunk: updateApplet, key: 'applet' });
  createAppletRejectedData({ builder, thunk: updateApplet, key: 'applet' });
};

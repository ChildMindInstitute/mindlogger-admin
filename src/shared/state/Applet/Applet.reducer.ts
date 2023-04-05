import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { AppletSchema } from './Applet.schema';
import { createApplet, getApplet, updateApplet } from './Applet.thunk';

import { appletPendingData, appletFulfilledData, appletRejectedData } from './Applet.utils';

export const extraReducers = (builder: ActionReducerMapBuilder<AppletSchema>): void => {
  appletPendingData({ builder, thunk: getApplet, key: 'applet' });
  appletFulfilledData({ builder, thunk: getApplet, key: 'applet' });
  appletRejectedData({ builder, thunk: getApplet, key: 'applet' });

  appletPendingData({ builder, thunk: createApplet, key: 'applet' });
  appletFulfilledData({ builder, thunk: createApplet, key: 'applet' });
  appletRejectedData({ builder, thunk: createApplet, key: 'applet' });

  appletPendingData({ builder, thunk: updateApplet, key: 'applet' });
  appletFulfilledData({ builder, thunk: updateApplet, key: 'applet' });
  appletRejectedData({ builder, thunk: updateApplet, key: 'applet' });
};

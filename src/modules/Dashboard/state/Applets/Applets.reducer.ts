import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { AppletsSchema } from './Applets.schema';
import { getApplet, getWorkspaceApplets } from './Applets.thunk';
import {
  deleteApplet,
  createAppletsPendingData,
  createAppletsFulfilledData,
  createAppletsRejectedData,
} from './Applets.utils';

export const reducers = { deleteApplet };

export const extraReducers = (builder: ActionReducerMapBuilder<AppletsSchema>): void => {
  createAppletsPendingData({ builder, thunk: getApplet, key: 'applet' });
  createAppletsPendingData({ builder, thunk: getWorkspaceApplets, key: 'applets' });

  createAppletsFulfilledData({ builder, thunk: getWorkspaceApplets, key: 'applets' });
  createAppletsFulfilledData({ builder, thunk: getApplet, key: 'applet' });

  createAppletsRejectedData({ builder, thunk: getApplet, key: 'applet' });
  createAppletsRejectedData({ builder, thunk: getWorkspaceApplets, key: 'applets' });
};

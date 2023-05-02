import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { AppletsSchema } from './Applets.schema';
import { getEvents, getWorkspaceApplets } from './Applets.thunk';

import {
  deleteApplet,
  resetAppletsData,
  createAppletsPendingData,
  createAppletsFulfilledData,
  createAppletsRejectedData,
} from './Applets.utils';

export const reducers = { deleteApplet, resetAppletsData };

export const extraReducers = (builder: ActionReducerMapBuilder<AppletsSchema>): void => {
  createAppletsPendingData({ builder, thunk: getWorkspaceApplets, key: 'applets' });
  createAppletsPendingData({ builder, thunk: getEvents, key: 'events' });

  createAppletsFulfilledData({ builder, thunk: getWorkspaceApplets, key: 'applets' });
  createAppletsFulfilledData({ builder, thunk: getEvents, key: 'events' });

  createAppletsRejectedData({ builder, thunk: getWorkspaceApplets, key: 'applets' });
  createAppletsRejectedData({ builder, thunk: getEvents, key: 'events' });
};

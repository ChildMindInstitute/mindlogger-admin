import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { AppletsSchema } from './Applets.schema';
import { getEvents } from './Applets.thunk';

import {
  resetEventsData,
  createAppletsPendingData,
  createAppletsFulfilledData,
  createAppletsRejectedData,
} from './Applets.utils';

export const reducers = { resetEventsData };

export const extraReducers = (builder: ActionReducerMapBuilder<AppletsSchema>): void => {
  createAppletsPendingData({ builder, thunk: getEvents, key: 'events' });

  createAppletsFulfilledData({ builder, thunk: getEvents, key: 'events' });

  createAppletsRejectedData({ builder, thunk: getEvents, key: 'events' });
};

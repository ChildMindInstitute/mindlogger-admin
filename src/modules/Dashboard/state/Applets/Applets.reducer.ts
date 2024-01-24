import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { getFulfilledData, getPendingData, getRejectedData } from 'shared/utils/state';

import { AppletsSchema } from './Applets.schema';
import { getEvents } from './Applets.thunk';
import { state as initialState } from './Applets.state';
import { resetEventsData } from './Applets.utils';

export const reducers = { resetEventsData };

export const extraReducers = (builder: ActionReducerMapBuilder<AppletsSchema>): void => {
  getPendingData({ builder, thunk: getEvents, key: 'events' });
  getFulfilledData({ builder, thunk: getEvents, key: 'events', initialState });
  getRejectedData({ builder, thunk: getEvents, key: 'events', initialState });
};

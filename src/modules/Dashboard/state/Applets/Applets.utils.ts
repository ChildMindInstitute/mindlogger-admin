import { PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { getApiError } from 'shared/utils';

import { AppletsSchema, CreateAppletsStateData } from './Applets.schema';
import { state as initialState } from './Applets.state';

export const resetEventsData = (state: AppletsSchema) => {
  state.events = initialState.events;
};

export const createAppletsPendingData = ({ builder, thunk, key }: CreateAppletsStateData) =>
  builder.addCase(thunk.pending, (state, action) => {
    if (state[key].status !== 'loading') {
      state[key].requestId = action.meta.requestId;
      state[key].status = 'loading';
    }
  });

export const createAppletsFulfilledData = ({ builder, thunk, key }: CreateAppletsStateData) =>
  builder.addCase(thunk.fulfilled, (state, action) => {
    if (state[key].status === 'loading' && state[key].requestId === action.meta.requestId) {
      state[key].requestId = initialState[key].requestId;
      state[key].status = 'success';
      state[key].data = action.payload.data;
    }
  });

export const createAppletsRejectedData = ({ builder, thunk, key }: CreateAppletsStateData) =>
  builder.addCase(thunk.rejected, (state, action) => {
    if (state[key].status === 'loading' && state[key].requestId === action.meta.requestId) {
      state[key].requestId = initialState[key].requestId;
      state[key].status = 'error';
      state[key].error = getApiError(action as PayloadAction<AxiosError>);
    }
  });

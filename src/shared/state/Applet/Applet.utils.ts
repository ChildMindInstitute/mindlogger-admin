import { PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { getApiError } from 'shared/utils';

import { CreateAppletStateData } from './Applet.schema';
import { state as initialState } from './Applet.state';

export const appletPendingData = ({ builder, thunk, key }: CreateAppletStateData) =>
  builder.addCase(thunk.pending, (state, action) => {
    if (state[key].status !== 'loading') {
      state[key].requestId = action.meta.requestId;
      state[key].status = 'loading';
    }
  });

export const appletFulfilledData = ({ builder, thunk, key }: CreateAppletStateData) =>
  builder.addCase(thunk.fulfilled, (state, action) => {
    if (state[key].status === 'loading' && state[key].requestId === action.meta.requestId) {
      state[key].requestId = initialState[key].requestId;
      state[key].status = 'success';
      state[key].data = action.payload.data;
    }
  });

export const appletRejectedData = ({ builder, thunk, key }: CreateAppletStateData) =>
  builder.addCase(thunk.rejected, (state, action) => {
    if (state[key].status === 'loading' && state[key].requestId === action.meta.requestId) {
      state[key].requestId = initialState[key].requestId;
      state[key].status = 'error';
      state[key].error = getApiError(action as PayloadAction<AxiosError>);
    }
  });

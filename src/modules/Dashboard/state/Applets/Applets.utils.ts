import { PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { Encryption, getApiError } from 'shared/utils';

import { Applet, AppletsSchema, CreateAppletsStateData } from './Applets.schema';
import { state as initialState } from './Applets.state';

export const deleteApplet = (
  { applets }: AppletsSchema,
  action: PayloadAction<{ id: string }>,
): void => {
  if (applets?.data) {
    applets.data.result = applets.data.result.filter((applet) => applet.id !== action.payload.id);
  }
};

export const resetAppletsData = (state: AppletsSchema) => {
  state.applets = initialState.applets;
};

export const resetEventsData = (state: AppletsSchema) => {
  state.events = initialState.events;
};

export const changeAppletEncryption = (
  state: AppletsSchema,
  action: PayloadAction<{
    applets: AppletsSchema;
    appletId: string;
    encryption: Encryption;
  }>,
) => {
  const {
    applets: { applets },
    appletId,
    encryption,
  } = action.payload;
  const updatedResult =
    applets.data?.result.map((applet: Applet) =>
      applet.id === appletId
        ? ({
            ...applet,
            encryption,
          } as Applet)
        : applet,
    ) ?? [];
  state.applets = {
    ...applets,
    data: {
      count: 0,
      ...applets.data,
      result: updatedResult,
    },
  };
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

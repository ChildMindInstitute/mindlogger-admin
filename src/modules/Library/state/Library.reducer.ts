import { ActionReducerMapBuilder, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { getApiError } from 'shared/utils/getApiError';

import { LibrarySchema } from './Library.schema';
import { getPublishedApplets } from './Library.thunk';
import { state as initialState } from './Library.state';

export const extraReducers = (builder: ActionReducerMapBuilder<LibrarySchema>): void => {
  builder.addCase(getPublishedApplets.pending, ({ publishedApplets }, action) => {
    if (publishedApplets.status !== 'loading') {
      publishedApplets.requestId = action.meta.requestId;
      publishedApplets.status = 'loading';
    }
  });

  builder.addCase(getPublishedApplets.fulfilled, ({ publishedApplets }, action) => {
    if (
      publishedApplets.status === 'loading' &&
      publishedApplets.requestId === action.meta.requestId
    ) {
      publishedApplets.requestId = initialState.publishedApplets.requestId;
      publishedApplets.status = 'success';
      publishedApplets.data = action.payload.data;
    }
  });

  builder.addCase(getPublishedApplets.rejected, ({ publishedApplets }, action) => {
    if (
      publishedApplets.status === 'loading' &&
      publishedApplets.requestId === action.meta.requestId
    ) {
      publishedApplets.requestId = initialState.publishedApplets.requestId;
      publishedApplets.status = 'error';
      publishedApplets.error = getApiError(action as PayloadAction<AxiosError>);
    }
  });
};

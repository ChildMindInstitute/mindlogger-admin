import { ActionReducerMapBuilder, AsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import get from 'lodash.get';
import uniqBy from 'lodash.uniqby';

import { BaseSchema } from '../state';

export const getPendingData = <T extends Record<string, BaseSchema>, K>({
  builder,
  thunk,
  key,
}: {
  builder: ActionReducerMapBuilder<T>;
  thunk: AsyncThunk<AxiosResponse['data'], K, Record<string, never>>;
  key: keyof T;
}) =>
  builder.addCase(thunk.pending, (state, action) => {
    const selectedProperty = get(state, key);

    if (selectedProperty.status !== 'loading') {
      selectedProperty.requestId = action.meta.requestId;
      selectedProperty.status = 'loading';
      selectedProperty.typePrefix = thunk.typePrefix;
    }
  });

export const getFulfilledData = <T extends Record<string, BaseSchema>, K>({
  builder,
  thunk,
  key,
  initialState,
  mapper = (payloadData) => payloadData,
}: {
  builder: ActionReducerMapBuilder<T>;
  thunk: AsyncThunk<AxiosResponse['data'], K, Record<string, never>>;
  key: keyof T;
  initialState: T;
  mapper?: (responseData: T) => unknown;
}) =>
  builder.addCase(thunk.fulfilled, (state, action) => {
    const selectedProperty = get(state, key);

    if (
      selectedProperty.status === 'loading' &&
      selectedProperty.requestId === action.meta.requestId
    ) {
      selectedProperty.requestId = initialState[key].requestId;
      selectedProperty.status = 'success';
      selectedProperty.data = mapper(action.payload?.data);
      selectedProperty.error = undefined;
    }
  });

export const getFulfilledDataWithConcatenatedResult = <T extends Record<string, BaseSchema>, K>({
  builder,
  thunk,
  key,
  initialState,
  mapper = (payloadData) => payloadData,
}: {
  builder: ActionReducerMapBuilder<T>;
  thunk: AsyncThunk<AxiosResponse['data'], K, Record<string, never>>;
  key: keyof T;
  initialState: T;
  mapper?: (responseData: T) => unknown;
}) =>
  builder.addCase(thunk.fulfilled, (state, action) => {
    const selectedProperty = get(state, key);

    if (
      selectedProperty.status === 'loading' &&
      selectedProperty.requestId === action.meta.requestId
    ) {
      selectedProperty.requestId = initialState[key].requestId;
      selectedProperty.status = 'success';
      selectedProperty.error = undefined;
      selectedProperty.data = mapper({
        ...(action.payload?.data ?? {}),
        result: uniqBy(
          (selectedProperty.data?.result ?? []).concat(action.payload?.data.result ?? []),
          'id',
        ),
      });
    }
  });

export const getRejectedData = <T extends Record<string, BaseSchema>, K>({
  builder,
  thunk,
  key,
  initialState,
}: {
  builder: ActionReducerMapBuilder<T>;
  thunk: AsyncThunk<AxiosResponse['data'], K, Record<string, never>>;
  key: keyof T;
  initialState: T;
}) =>
  builder.addCase(thunk.rejected, (state, action) => {
    const selectedProperty = get(state, key);

    if (
      selectedProperty.status === 'loading' &&
      selectedProperty.requestId === action.meta.requestId
    ) {
      selectedProperty.requestId = initialState[key].requestId;
      selectedProperty.status = 'error';
      selectedProperty.error = action.payload;
      selectedProperty.data = initialState[key].data;
    }
  });

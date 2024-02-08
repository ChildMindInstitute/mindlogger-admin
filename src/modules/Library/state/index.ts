import { createSlice } from '@reduxjs/toolkit';

import { useAppSelector } from 'redux/store/hooks';
import { MetaStatus } from 'shared/state';

import { extraReducers, reducers } from './Library.reducer';
import { LibrarySchema } from './Library.schema';
import { state as initialState } from './Library.state';
import * as thunk from './Library.thunk';

export * from './Library.schema';

const slice = createSlice({
  name: 'library',
  initialState,
  reducers,
  extraReducers,
});

export const library = {
  thunk,
  slice,
  actions: slice.actions,
  usePublishedApplets: (): LibrarySchema['publishedApplets']['data'] =>
    useAppSelector(
      ({
        library: {
          publishedApplets: { data },
        },
      }) => data,
    ),
  useCartApplets: (): LibrarySchema['cartApplets']['data'] =>
    useAppSelector(
      ({
        library: {
          cartApplets: { data },
        },
      }) => data,
    ),
  useIsAddToBuilderBtnDisabled: (): LibrarySchema['isAddToBuilderBtnDisabled']['data'] =>
    useAppSelector(
      ({
        library: {
          isAddToBuilderBtnDisabled: { data },
        },
      }) => data,
    ),
  usePublishedAppletsStatus: (): MetaStatus =>
    useAppSelector(
      ({
        library: {
          publishedApplets: { status },
        },
      }) => status,
    ),
  useCartAppletsStatus: (): MetaStatus =>
    useAppSelector(
      ({
        library: {
          cartApplets: { status },
        },
      }) => status,
    ),
};

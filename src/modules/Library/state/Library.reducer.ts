import { ActionReducerMapBuilder, PayloadAction } from '@reduxjs/toolkit';

import { getFulfilledData, getPendingData, getRejectedData } from 'shared/utils/state';

import { LibrarySchema, PublishedApplet } from './Library.schema';
import { getAppletsFromCart, getPublishedApplets, postAppletsToCart } from './Library.thunk';
import { state as initialState } from './Library.state';
import { mapPostCartItems } from './Library.utils';

export const reducers = {
  setAppletsFromStorage: (state: LibrarySchema, action: PayloadAction<PublishedApplet[]>): void => {
    state.cartApplets.data.result = action.payload;
    state.cartApplets.data.count = action.payload?.length ?? 0;
    state.cartApplets.status = 'success';
  },
  setAddToBuilderBtnDisabled: (state: LibrarySchema, action: PayloadAction<boolean>): void => {
    state.isAddToBuilderBtnDisabled.data = action.payload;
    state.isAddToBuilderBtnDisabled.status = 'success';
  },
};

export const extraReducers = (builder: ActionReducerMapBuilder<LibrarySchema>): void => {
  getPendingData({ builder, thunk: getPublishedApplets, key: 'publishedApplets' });
  getFulfilledData({ builder, thunk: getPublishedApplets, key: 'publishedApplets', initialState });
  getRejectedData({ builder, thunk: getPublishedApplets, key: 'publishedApplets', initialState });

  getPendingData({ builder, thunk: getAppletsFromCart, key: 'cartApplets' });
  getFulfilledData({
    builder,
    thunk: getAppletsFromCart,
    key: 'cartApplets',
    initialState,
  });
  getRejectedData({ builder, thunk: getAppletsFromCart, key: 'cartApplets', initialState });

  getPendingData({ builder, thunk: postAppletsToCart, key: 'cartApplets' });
  getFulfilledData({
    builder,
    thunk: postAppletsToCart,
    key: 'cartApplets',
    initialState,
    mapper: mapPostCartItems,
  });
  getRejectedData({ builder, thunk: postAppletsToCart, key: 'cartApplets', initialState });
};

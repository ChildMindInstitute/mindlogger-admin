import { ActionReducerMapBuilder, PayloadAction } from '@reduxjs/toolkit';

import { getFulfilledData, getPendingData, getRejectedData } from 'shared/utils';

import { LibrarySchema, PublishedApplet } from './Library.schema';
import { getAppletsFromCart, getPublishedApplets, postAppletsToCart } from './Library.thunk';
import { state as initialState } from './Library.state';

export const reducers = {
  setAppletsFromStorage: (state: LibrarySchema, action: PayloadAction<PublishedApplet[]>): void => {
    state.cartApplets.data.result.cartItems = action.payload;
    state.cartApplets.status = 'success';
  },
  setAddToCartBtnDisabled: (state: LibrarySchema, action: PayloadAction<boolean>): void => {
    state.isCartBtnDisabled.data = action.payload;
    state.isCartBtnDisabled.status = 'success';
  },
};

export const extraReducers = (builder: ActionReducerMapBuilder<LibrarySchema>): void => {
  getPendingData({ builder, thunk: getPublishedApplets, key: 'publishedApplets' });
  getFulfilledData({ builder, thunk: getPublishedApplets, key: 'publishedApplets', initialState });
  getRejectedData({ builder, thunk: getPublishedApplets, key: 'publishedApplets', initialState });

  getPendingData({ builder, thunk: getAppletsFromCart, key: 'cartApplets' });
  getFulfilledData({ builder, thunk: getAppletsFromCart, key: 'cartApplets', initialState });
  getRejectedData({ builder, thunk: getAppletsFromCart, key: 'cartApplets', initialState });

  getPendingData({ builder, thunk: postAppletsToCart, key: 'cartApplets' });
  getFulfilledData({ builder, thunk: postAppletsToCart, key: 'cartApplets', initialState });
  getRejectedData({ builder, thunk: postAppletsToCart, key: 'cartApplets', initialState });
};

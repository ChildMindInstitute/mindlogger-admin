import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { getFulfilledDataWithConcatenatedResult, getPendingData, getRejectedData } from 'shared/utils/state';

import { state as initialState } from './Themes.state';
import { ThemesSchema } from './Themes.schema';
import { getThemes } from './Themes.thunk';

export const reducers = {
  resetThemes: (state: ThemesSchema): void => {
    state.themes = initialState.themes;
  },
};

export const extraReducers = (builder: ActionReducerMapBuilder<ThemesSchema>): void => {
  getPendingData({ builder, thunk: getThemes, key: 'themes' });

  getFulfilledDataWithConcatenatedResult({
    builder,
    thunk: getThemes,
    key: 'themes',
    initialState,
  });

  getRejectedData({
    builder,
    thunk: getThemes,
    key: 'themes',
    initialState,
  });
};

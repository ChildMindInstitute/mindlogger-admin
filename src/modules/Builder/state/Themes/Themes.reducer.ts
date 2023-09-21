import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { getPendingData, getFulfilledData, getRejectedData } from 'shared/utils/state';

import { state as initialState } from './Themes.state';
import { ThemesSchema } from './Themes.schema';
import { getThemes } from './Themes.thunk';

export const extraReducers = (builder: ActionReducerMapBuilder<ThemesSchema>): void => {
  getPendingData({ builder, thunk: getThemes, key: 'themes' });
  getFulfilledData({
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

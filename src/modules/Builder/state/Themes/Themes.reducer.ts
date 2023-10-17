import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import uniqBy from 'lodash.uniqby';

import { getPendingData, getRejectedData } from 'shared/utils/state';

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

  builder.addCase(getThemes.fulfilled, ({ themes }, { payload }) => {
    themes.requestId = initialState.themes.requestId;
    themes.status = 'success';
    themes.data = {
      count: payload?.data.count,
      result: uniqBy((themes.data?.result ?? []).concat(payload?.data.result), 'id'),
    };
  });

  getRejectedData({
    builder,
    thunk: getThemes,
    key: 'themes',
    initialState,
  });
};

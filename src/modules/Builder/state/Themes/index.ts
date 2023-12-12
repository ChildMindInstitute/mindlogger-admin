import { createSlice } from '@reduxjs/toolkit';

import { useAppSelector } from 'redux/store/hooks';

import * as thunk from './Themes.thunk';
import { state as initialState } from './Themes.state';
import { extraReducers, reducers } from './Themes.reducer';
import { ThemesSchema } from './Themes.schema';

export * from './Themes.schema';

const slice = createSlice({
  name: 'themes',
  initialState,
  extraReducers,
  reducers,
});

export const themes = {
  thunk,
  slice,
  actions: slice.actions,
  useThemesData: (): ThemesSchema['themes']['data'] =>
    useAppSelector(
      ({
        themes: {
          themes: { data },
        },
      }) => data,
    ),
  useThemesStatus: (): ThemesSchema['themes']['status'] =>
    useAppSelector(
      ({
        themes: {
          themes: { status },
        },
      }) => status,
    ),
};

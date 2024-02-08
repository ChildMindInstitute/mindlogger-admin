import { createSlice } from '@reduxjs/toolkit';

import { useAppSelector } from 'redux/store/hooks';

import { extraReducers, reducers } from './Themes.reducer';
import { ThemesSchema } from './Themes.schema';
import { state as initialState } from './Themes.state';
import * as thunk from './Themes.thunk';

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

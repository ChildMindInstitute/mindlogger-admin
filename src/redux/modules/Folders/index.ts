import { createSlice } from '@reduxjs/toolkit';

import { useAppSelector } from 'redux/store';

import * as thunk from './Folders.thunk';
import { state as initialState } from './Folders.state';
import { reducers, extraReducers } from './Folders.reducer';
import { FoldersSchema } from './Folders.schema';

export * from './Folders.schema';

const slice = createSlice({
  name: 'folders',
  initialState,
  reducers,
  extraReducers,
});

export const folders = {
  thunk,
  slice,
  actions: slice.actions,
  useFoldersApplets: (): FoldersSchema['foldersApplets']['data'] =>
    useAppSelector(
      ({
        folders: {
          foldersApplets: { data },
        },
      }) => data,
    ),
  useFlattenFoldersApplets: (): FoldersSchema['flattenFoldersApplets']['data'] =>
    useAppSelector(
      ({
        folders: {
          flattenFoldersApplets: { data },
        },
      }) => data,
    ),
};

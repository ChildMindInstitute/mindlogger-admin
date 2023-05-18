import { createSlice } from '@reduxjs/toolkit';

import { useAppSelector } from 'redux/store';

import * as thunk from './Folders.thunk';
import { state as initialState } from './Folders.state';
import { reducers, extraReducers } from './Folders.reducer';
import { FolderApplet, FoldersSchema } from './Folders.schema';

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
  useFolders: (): FoldersSchema['folders']['data'] =>
    useAppSelector(
      ({
        folders: {
          folders: { data },
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
  useApplet: (id: string): FolderApplet =>
    useAppSelector(
      ({
        folders: {
          flattenFoldersApplets: { data },
        },
      }) => data.find((applet: FolderApplet) => applet.id === id),
    ),
  useStatus: (): FoldersSchema['flattenFoldersApplets']['status'] =>
    useAppSelector(
      ({
        folders: {
          foldersApplets: { status },
        },
      }) => status,
    ),
};

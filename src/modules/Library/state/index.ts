import { createSlice } from '@reduxjs/toolkit';

import { useAppSelector } from 'redux/store';

import * as thunk from './Library.thunk';
import { state as initialState } from './Library.state';
import { extraReducers } from './Library.reducer';
import { LibrarySchema, PublishedApplet } from './Library.schema';

export * from './Library.schema';

const slice = createSlice({
  name: 'library',
  initialState,
  reducers: {},
  extraReducers,
});

export const library = {
  thunk,
  slice,
  usePublishedApplets: (): LibrarySchema['publishedApplets']['data'] =>
    useAppSelector(
      ({
        library: {
          publishedApplets: { data },
        },
      }) => data,
    ),
  usePublishedApplet: (id: string): PublishedApplet =>
    useAppSelector(
      ({
        library: {
          publishedApplets: { data },
        },
      }) => data?.result?.find((applet: PublishedApplet) => id === applet.id),
    ),
};

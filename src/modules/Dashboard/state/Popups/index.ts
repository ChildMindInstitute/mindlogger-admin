import { createSlice } from '@reduxjs/toolkit';

import { useAppSelector } from 'redux/store/hooks';

import { reducers } from './Popups.reducer';
import { PopupsSchema } from './Popups.schema';
import { state as initialState } from './Popups.state';

export * from './Popups.schema';

const slice = createSlice({
  name: 'popups',
  initialState,
  reducers,
});

export const popups = {
  slice,
  actions: slice.actions,
  useData: (): PopupsSchema['data'] => useAppSelector(({ popups: { data } }) => data),
};

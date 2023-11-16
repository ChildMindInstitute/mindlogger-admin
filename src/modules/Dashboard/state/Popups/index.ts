import { createSlice } from '@reduxjs/toolkit';

import { useAppSelector } from 'redux/store/hooks';

import { state as initialState } from './Popups.state';
import { reducers } from './Popups.reducer';
import { PopupsSchema } from './Popups.schema';

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

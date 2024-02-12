import { createSlice } from '@reduxjs/toolkit';

import { useAppSelector } from 'redux/store/hooks';

import { state as initialState } from './Banners.state';
import { reducers } from './Banners.reducer';
import { BannersSchema } from './Banners.schema';

export * from './Banners.schema';

const slice = createSlice({
  name: 'banners',
  initialState,
  reducers,
});

export const banners = {
  slice,
  actions: slice.actions,
  useData: (): BannersSchema['data'] => useAppSelector(({ banners: { data } }) => data),
};

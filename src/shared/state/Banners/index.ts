import { createSlice } from '@reduxjs/toolkit';

import { useAppSelector } from 'redux/store/hooks';

import { reducers } from './Banners.reducer';
import { BannersSchema } from './Banners.schema';
import { state as initialState } from './Banners.state';

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

import { createSlice } from '@reduxjs/toolkit';

import { useAppSelector } from 'redux/store';

import { state as initialState } from './Breadcrumbs.state';
import { reducers } from './Breadcrumbs.reducer';
import { BreadcrumbsSchema } from './Breadcrumbs.schema';

export * from './Breadcrumbs.schema';

const slice = createSlice({
  name: 'breadcrumbs',
  initialState,
  reducers,
});

export const breadcrumbs = {
  slice,
  actions: slice.actions,
  useData: (): BreadcrumbsSchema['data'] => useAppSelector(({ breadcrumbs: { data } }) => data),
};

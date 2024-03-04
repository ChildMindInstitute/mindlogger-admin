import { createSlice } from '@reduxjs/toolkit';

import { useAppSelector } from 'redux/store/hooks';

import { state as initialState } from './ForbiddenState.state';
import { reducers } from './ForbiddenState.reducer';
import { ForbiddenStateSchema } from './ForbiddenState.schema';

export * from './ForbiddenState.schema';

const slice = createSlice({
  name: 'forbiddenState',
  initialState,
  reducers,
});

export const forbiddenState = {
  slice,
  actions: slice.actions,
  useData: (): ForbiddenStateSchema['data'] =>
    useAppSelector(({ forbiddenState: { data } }) => data),
};

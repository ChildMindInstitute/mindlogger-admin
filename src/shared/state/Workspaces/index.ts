import { createSlice } from '@reduxjs/toolkit';

import { useAppSelector } from 'redux/store';

import { state as initialState } from './Workspaces.state';
import { reducers } from './Workspaces.reducer';
import { WorkspacesSchema } from './Workspaces.schema';

export * from './Workspaces.schema';

const slice = createSlice({
  name: 'workspaces',
  initialState,
  reducers,
});

export const workspaces = {
  slice,
  actions: slice.actions,
  useData: (): WorkspacesSchema['currentWorkspace'] =>
    useAppSelector(({ workspaces: { currentWorkspace } }) => currentWorkspace),
};

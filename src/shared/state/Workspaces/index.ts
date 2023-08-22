import { createSlice } from '@reduxjs/toolkit';

import { useAppSelector } from 'redux/store';

import * as thunk from './Workspaces.thunk';
import { state as initialState } from './Workspaces.state';
import { reducers, extraReducers } from './Workspaces.reducer';
import { WorkspacesSchema } from './Workspaces.schema';

export * from './Workspaces.schema';

const slice = createSlice({
  name: 'workspaces',
  initialState,
  reducers,
  extraReducers,
});

export const workspaces = {
  thunk,
  slice,
  actions: slice.actions,
  useWorkspacesData: (): WorkspacesSchema['workspaces']['data'] =>
    useAppSelector(({ workspaces: { workspaces } }) => workspaces?.data),
  useData: (): WorkspacesSchema['currentWorkspace']['data'] =>
    useAppSelector(({ workspaces: { currentWorkspace } }) => currentWorkspace?.data),
  useRolesData: (): WorkspacesSchema['roles'] =>
    useAppSelector(({ workspaces: { roles } }) => roles),
  useWorkspacesRolesData: (): WorkspacesSchema['workspacesRoles']['data'] =>
    useAppSelector(({ workspaces: { workspacesRoles } }) => workspacesRoles?.data),
};

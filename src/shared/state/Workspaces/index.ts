import { createSlice } from '@reduxjs/toolkit';

import { useAppSelector } from 'redux/store/hooks';

import { MetaStatus } from '../Base';
import { reducers, extraReducers } from './Workspaces.reducer';
import { WorkspacesSchema } from './Workspaces.schema';
import { state as initialState } from './Workspaces.state';
import * as thunk from './Workspaces.thunk';

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
  useRolesData: (): WorkspacesSchema['roles'] => useAppSelector(({ workspaces: { roles } }) => roles),
  useRolesResponseStatus: (): MetaStatus =>
    useAppSelector(
      ({
        workspaces: {
          roles: { status },
        },
      }) => status,
    ),
};

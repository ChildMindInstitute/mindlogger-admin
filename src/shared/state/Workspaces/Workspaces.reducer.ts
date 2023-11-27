import { ActionReducerMapBuilder, PayloadAction } from '@reduxjs/toolkit';

import { getFulfilledData, getPendingData, getRejectedData } from 'shared/utils/state';

import { Workspace, WorkspacesSchema } from './Workspaces.schema';
import { getWorkspaceRoles, getWorkspaces } from './Workspaces.thunk';
import { state as initialState } from './Workspaces.state';

export const reducers = {
  setCurrentWorkspace: (state: WorkspacesSchema, action: PayloadAction<Workspace | null>): void => {
    state.currentWorkspace.data = action.payload;
  },
};

export const extraReducers = (builder: ActionReducerMapBuilder<WorkspacesSchema>): void => {
  getPendingData({ builder, thunk: getWorkspaceRoles, key: 'roles' });
  builder.addCase(getWorkspaceRoles.fulfilled, ({ roles }, action) => {
    if (roles.status === 'loading' && roles.requestId === action.meta.requestId) {
      roles.requestId = initialState.roles.requestId;
      roles.status = 'success';
      roles.data = action.payload.data?.result;
      roles.error = undefined;
    }
  });
  getRejectedData({ builder, thunk: getWorkspaceRoles, key: 'roles', initialState });

  getPendingData({ builder, thunk: getWorkspaces, key: 'workspaces' });
  getFulfilledData({ builder, thunk: getWorkspaces, key: 'workspaces', initialState });
  getRejectedData({ builder, thunk: getWorkspaces, key: 'workspaces', initialState });
};

import { ActionReducerMapBuilder, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { getApiError } from 'shared/utils';

import { Workspace, WorkspacesSchema } from './Workspaces.schema';
import { getWorkspaceRoles } from './Workspaces.thunk';
import { state as initialState } from './Workspaces.state';

export const reducers = {
  setCurrentWorkspace: (state: WorkspacesSchema, action: PayloadAction<Workspace | null>): void => {
    state.currentWorkspace = action.payload;
  },
};

export const extraReducers = (builder: ActionReducerMapBuilder<WorkspacesSchema>): void => {
  builder.addCase(getWorkspaceRoles.pending, ({ roles }, action) => {
    if (roles.status !== 'loading') {
      roles.requestId = action.meta.requestId;
      roles.status = 'loading';
    }
  });

  builder.addCase(getWorkspaceRoles.fulfilled, ({ roles }, action) => {
    if (roles.status === 'loading' && roles.requestId === action.meta.requestId) {
      roles.requestId = initialState.roles.requestId;
      roles.status = 'success';
      roles.data = action.payload.data?.result;
    }
  });

  builder.addCase(getWorkspaceRoles.rejected, ({ roles }, action) => {
    if (roles.status === 'loading' && roles.requestId === action.meta.requestId) {
      roles.requestId = initialState.roles.requestId;
      roles.status = 'error';
      roles.error = getApiError(action as PayloadAction<AxiosError>);
    }
  });
};

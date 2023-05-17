import { ActionReducerMapBuilder, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { getApiError } from 'shared/utils';

import { Workspace, WorkspacesSchema } from './Workspaces.schema';
import { getWorkspacePriorityRole } from './Workspaces.thunk';
import { state as initialState } from './Workspaces.state';

export const reducers = {
  setCurrentWorkspace: (state: WorkspacesSchema, action: PayloadAction<Workspace | null>): void => {
    state.currentWorkspace = action.payload;
  },
};

export const extraReducers = (builder: ActionReducerMapBuilder<WorkspacesSchema>): void => {
  builder.addCase(getWorkspacePriorityRole.pending, ({ priorityRole }, action) => {
    if (priorityRole.status !== 'loading') {
      priorityRole.requestId = action.meta.requestId;
      priorityRole.status = 'loading';
    }
  });

  builder.addCase(getWorkspacePriorityRole.fulfilled, ({ priorityRole }, action) => {
    if (priorityRole.status === 'loading' && priorityRole.requestId === action.meta.requestId) {
      priorityRole.requestId = initialState.priorityRole.requestId;
      priorityRole.status = 'success';
      priorityRole.data = action.payload.data?.result?.role;
    }
  });

  builder.addCase(getWorkspacePriorityRole.rejected, ({ priorityRole }, action) => {
    if (priorityRole.status === 'loading' && priorityRole.requestId === action.meta.requestId) {
      priorityRole.requestId = initialState.priorityRole.requestId;
      priorityRole.status = 'error';
      priorityRole.error = getApiError(action as PayloadAction<AxiosError>);
    }
  });
};

import { PayloadAction } from '@reduxjs/toolkit';

import { Workspace, WorkspacesSchema } from './Workspaces.schema';

export const reducers = {
  setCurrentWorkspace: (state: WorkspacesSchema, action: PayloadAction<Workspace>): void => {
    state.currentWorkspace = action.payload;
  },
};

import { PayloadAction } from '@reduxjs/toolkit';

import { Workspace, WorkspacesSchema } from './Workspaces.schema';

export const reducers = {
  setCurrentWorkspace: (state: WorkspacesSchema, action: PayloadAction<Workspace | null>): void => {
    state.currentWorkspace = action.payload;
  },
};

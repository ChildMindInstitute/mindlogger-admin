import { base } from 'shared/state/Base';

import { WorkspacesSchema } from './Workspaces.schema';

const initialStateData = {
  ...base.state,
  data: null,
};

export const state: WorkspacesSchema = {
  workspaces: initialStateData,
  currentWorkspace: initialStateData,
  roles: initialStateData,
  workspacesRoles: initialStateData,
};

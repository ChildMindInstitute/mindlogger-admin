import { base } from 'shared/state/Base';

import { WorkspacesSchema } from './Workspaces.schema';

const initialStateData = {
  ...base.state,
  data: null,
};

export const state: WorkspacesSchema = {
  currentWorkspace: null,
  priorityRole: initialStateData,
};

import { initialStateData } from '../Base';
import { WorkspacesSchema } from './Workspaces.schema';

export const state: WorkspacesSchema = {
  workspaces: initialStateData,
  currentWorkspace: initialStateData,
  roles: initialStateData,
  workspacesRoles: initialStateData,
};

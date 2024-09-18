import { Workspace } from 'shared/state/Workspaces';

export const getWorkspaceNames = (workspacesData: Workspace[]) =>
  workspacesData.map((workspace: { workspaceName: string }) => workspace.workspaceName);

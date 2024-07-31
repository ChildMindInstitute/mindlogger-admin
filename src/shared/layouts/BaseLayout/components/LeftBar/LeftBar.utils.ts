import { Workspace } from 'redux/modules';

export const getWorkspaceNames = (workspacesData: Workspace[]) =>
  workspacesData.map((workspace: { workspaceName: string }) => workspace.workspaceName);

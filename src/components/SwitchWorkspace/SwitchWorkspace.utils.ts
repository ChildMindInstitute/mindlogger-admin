import { workspacesGroups } from './SwitchWorkspace.const';
import { Workspace, WorkspaceGroup, WorkspaceGroups } from './SwitchWorkspace.types';

export const getWorkspacesGroups = (workspaces: Workspace[]): WorkspaceGroup[] =>
  workspacesGroups.map((workspace) => ({
    ...workspace,
    workspaces: workspaces.filter((ws) =>
      workspace.groupName === WorkspaceGroups.MyWorkspace ? ws.owned : !ws.owned,
    ),
  }));

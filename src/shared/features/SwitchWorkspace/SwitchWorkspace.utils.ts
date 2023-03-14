import { workspacesGroups } from './SwitchWorkspace.const';
import { Workspace, WorkspaceGroup, WorkspaceGroups } from './SwitchWorkspace.types';

export const getWorkspacesGroups = (workspaces: Workspace[]): WorkspaceGroup[] => {
  const groups: { [key in WorkspaceGroups]: Workspace[] } = {
    [WorkspaceGroups.MyWorkspace]: [],
    [WorkspaceGroups.SharedWorkspaces]: [],
  };
  const filteredGroups = workspaces.reduce((groups, workspace) => {
    if (workspace.owned) {
      groups[WorkspaceGroups.MyWorkspace].push(workspace);
    } else {
      groups[WorkspaceGroups.SharedWorkspaces].push(workspace);
    }

    return groups;
  }, groups);

  return workspacesGroups.map((workspace) => ({
    ...workspace,
    workspaces: filteredGroups[workspace.groupName],
  }));
};

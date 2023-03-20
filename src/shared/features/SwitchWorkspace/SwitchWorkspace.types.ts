import { Dispatch, SetStateAction } from 'react';

export type Workspace = {
  accountId: string;
  workspaceName: string;
  owned: boolean;
  image?: string;
};

export enum WorkspaceGroups {
  MyWorkspace = 'myWorkspace',
  SharedWorkspaces = 'sharedWorkspaces',
}

export type WorkspaceGroup = {
  groupName: WorkspaceGroups;
  workspaces: Workspace[];
  emptyState?: string;
};

export type SwitchWorkspaceProps = {
  currentWorkspace: Workspace;
  setCurrentWorkspace: Dispatch<SetStateAction<Workspace>>;
  visibleDrawer: boolean;
  setVisibleDrawer: Dispatch<SetStateAction<boolean>>;
  workspaces: Workspace[];
};

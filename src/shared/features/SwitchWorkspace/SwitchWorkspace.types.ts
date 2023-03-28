import { Dispatch, SetStateAction } from 'react';

export type Workspace = {
  ownerId: string;
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
  currentWorkspace: Workspace | null;
  setCurrentWorkspace: (val: Workspace | null) => void;
  visibleDrawer: boolean;
  setVisibleDrawer: Dispatch<SetStateAction<boolean>>;
  workspaces: Workspace[];
};

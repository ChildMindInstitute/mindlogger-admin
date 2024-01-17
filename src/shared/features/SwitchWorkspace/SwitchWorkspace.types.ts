import { Dispatch, SetStateAction } from 'react';

import { Workspace } from 'shared/state';

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
  visibleDrawer: boolean;
  setVisibleDrawer: Dispatch<SetStateAction<boolean>>;
  workspaces: Workspace[];
  onChangeWorkspace: (workspace: Workspace) => void;
  'data-testid'?: string;
};

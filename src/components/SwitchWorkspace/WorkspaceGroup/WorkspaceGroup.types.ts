import { Dispatch, SetStateAction } from 'react';

import { Workspace } from '../SwitchWorkspace.types';

export type WorkspaceGroupProps = {
  groupName: string;
  workspaces: Workspace[];
  currentWorkspace: Workspace;
  setCurrentWorkspace: Dispatch<SetStateAction<Workspace>>;
};

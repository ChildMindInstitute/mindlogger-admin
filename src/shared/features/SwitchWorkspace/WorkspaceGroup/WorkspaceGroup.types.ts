import { Dispatch, SetStateAction } from 'react';

import { Workspace, WorkspaceGroup } from '../SwitchWorkspace.types';

export type WorkspaceGroupProps = {
  workspacesGroup: WorkspaceGroup;
  currentWorkspace: Workspace;
  setCurrentWorkspace: Dispatch<SetStateAction<Workspace>>;
};

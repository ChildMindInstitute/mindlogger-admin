import { Workspace } from 'redux/modules';

import { WorkspaceGroup } from '../SwitchWorkspace.types';

export type WorkspaceGroupProps = {
  workspacesGroup: WorkspaceGroup;
  onChangeWorkspace: (workspace: Workspace) => void;
  'data-testid'?: string;
};

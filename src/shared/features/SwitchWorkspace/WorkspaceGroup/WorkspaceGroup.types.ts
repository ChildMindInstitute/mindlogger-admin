import { SwitchWorkspaceProps, WorkspaceGroup } from '../SwitchWorkspace.types';

export type WorkspaceGroupProps = {
  workspacesGroup: WorkspaceGroup;
} & Pick<SwitchWorkspaceProps, 'currentWorkspace' | 'setCurrentWorkspace'>;

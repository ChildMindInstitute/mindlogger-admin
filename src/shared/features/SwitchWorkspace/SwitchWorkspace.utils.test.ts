import { Workspace } from 'shared/state';

import { getWorkspacesGroups } from './SwitchWorkspace.utils';
import { WorkspaceGroup, WorkspaceGroups } from './SwitchWorkspace.types';

describe('getWorkspacesGroups', () => {
  test('should group workspaces correctly', () => {
    const workspaces: Workspace[] = [
      { ownerId: 'user1', workspaceName: 'workspace1' },
      { ownerId: 'user2', workspaceName: 'workspace2' },
      { ownerId: 'user1', workspaceName: 'workspace3' },
      { ownerId: 'user2', workspaceName: 'workspace4' },
    ];
    const id = 'user1';

    const expectedGroups: WorkspaceGroup[] = [
      {
        groupName: WorkspaceGroups.MyWorkspace,
        workspaces: [
          { ownerId: 'user1', workspaceName: 'workspace1' },
          { ownerId: 'user1', workspaceName: 'workspace3' },
        ],
      },
      {
        emptyState: 'noSharedWorkspaces',
        groupName: WorkspaceGroups.SharedWorkspaces,
        workspaces: [
          { ownerId: 'user2', workspaceName: 'workspace2' },
          { ownerId: 'user2', workspaceName: 'workspace4' },
        ],
      },
    ];

    const result = getWorkspacesGroups(workspaces, id);

    expect(result).toEqual(expectedGroups);
  });
});

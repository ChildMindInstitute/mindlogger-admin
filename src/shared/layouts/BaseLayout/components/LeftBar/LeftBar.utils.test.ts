import { Workspace } from 'shared/state/Workspaces';

import { resolveCurrentWorkspace } from './LeftBar.utils';

const ownWorkspace = { ownerId: 'user-3', workspaceName: 'Carl Owner' } as Workspace;
const sharedWorkspace = { ownerId: 'user-2', workspaceName: 'Bea Shared' } as Workspace;
const strangerWorkspace = { ownerId: 'user-1', workspaceName: 'Ann Stranger' } as Workspace;

describe('resolveCurrentWorkspace', () => {
  it('opens on the workspace the user last chose', () => {
    const workspacesData = [ownWorkspace, sharedWorkspace];

    expect(resolveCurrentWorkspace(workspacesData, 'user-3', sharedWorkspace)).toBe(
      sharedWorkspace,
    );
  });

  it('opens on the user own workspace when nothing was chosen', () => {
    expect(resolveCurrentWorkspace([ownWorkspace, sharedWorkspace], 'user-3', null)).toBe(
      ownWorkspace,
    );
  });

  // A workspace left in storage by whoever used the browser before, which a logout failed to clear.
  it('ignores a stored workspace the user cannot reach', () => {
    const workspacesData = [ownWorkspace, sharedWorkspace];

    expect(resolveCurrentWorkspace(workspacesData, 'user-3', strangerWorkspace)).toBe(ownWorkspace);
  });

  // Nothing to fall back to, so it opens on nothing rather than on someone else's workspace.
  it('returns null when the user owns nothing and the stored workspace is not theirs', () => {
    expect(resolveCurrentWorkspace([sharedWorkspace], 'user-3', strangerWorkspace)).toBeNull();
  });
});

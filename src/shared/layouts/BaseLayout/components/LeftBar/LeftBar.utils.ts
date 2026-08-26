import { Workspace } from 'shared/state/Workspaces';

export const getWorkspaceNames = (workspacesData: Workspace[]) =>
  workspacesData.map((workspace: { workspaceName: string }) => workspace.workspaceName);

// The workspace to open on, given what the user last chose and what they can actually reach. A
// stored workspace missing from the list belongs to whoever used this browser before them, so it is
// dropped rather than trusted: their own workspace is the only safe thing to fall back to.
export const resolveCurrentWorkspace = (
  workspacesData: Workspace[] | undefined,
  userId: string | undefined,
  storageWorkspace: Workspace | null,
) => {
  const ownerWorkspace = workspacesData?.find((item) => item.ownerId === userId);
  const isStoredWorkspaceOwned = workspacesData?.some(
    (item) => item.ownerId === storageWorkspace?.ownerId,
  );

  return (isStoredWorkspaceOwned ? storageWorkspace : null) ?? ownerWorkspace ?? null;
};

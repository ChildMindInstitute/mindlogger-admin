import { useState, useEffect } from 'react';

import { getWorkspacesApi, getWorkspaceRolesApi } from 'api';
import { useAsync } from 'shared/hooks';
import { WorkspaceWithRoles } from 'redux/modules';
import { isManagerOrOwnerOrEditor } from 'shared/utils';

export const useWorkspaceList = () => {
  const [workspaces, setWorkspaces] = useState<WorkspaceWithRoles[]>([]);
  const [isLoading, setLoading] = useState(true);

  const { execute: getWorkspaces } = useAsync(getWorkspacesApi);
  const { execute: getWorkspacesRoles } = useAsync(getWorkspaceRolesApi);

  const getWorkspaceWithRole = async ({
    ownerId,
    workspaceName,
  }: {
    ownerId: string;
    workspaceName?: string;
  }) => {
    const { data } = await getWorkspacesRoles({ ownerId });

    return {
      ownerId,
      workspaceName,
      workspaceRoles: data?.result,
    };
  };

  const getWorkspaceList = async (ownerId?: string) => {
    setLoading(true);

    try {
      const { data: workspacesData = [] } = await getWorkspaces(undefined);

      const workspacesRoles = await Promise.all(
        ownerId
          ? [await getWorkspaceWithRole({ ownerId })]
          : workspacesData?.result?.map(
              async ({ ownerId, workspaceName }: WorkspaceWithRoles) =>
                await getWorkspaceWithRole({ ownerId, workspaceName }),
            ),
      );

      const workspaces =
        workspacesRoles?.filter(
          (workspace: WorkspaceWithRoles) =>
            Object.keys(workspace?.workspaceRoles).length === 0 || //in case there are no applets yet in the main Workspace
            Object.values(workspace?.workspaceRoles).some((roles) =>
              isManagerOrOwnerOrEditor(roles[0]),
            ),
        ) || [];

      return workspaces;
    } catch (e) {
      console.warn(e);

      return [];
    } finally {
      setLoading(false);
    }
  };

  const checkIfHasAccessToWorkspace = async (ownerId: string) => {
    const workspaces = await getWorkspaceList(ownerId);

    return workspaces?.length > 0;
  };

  useEffect(() => {
    (async () => {
      const workspaces = await getWorkspaceList();

      setWorkspaces(workspaces);
    })();
  }, []);

  return {
    workspaces,
    isLoading,
    checkIfHasAccessToWorkspace,
  };
};

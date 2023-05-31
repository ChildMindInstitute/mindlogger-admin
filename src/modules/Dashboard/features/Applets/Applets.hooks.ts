import { useState, Dispatch, SetStateAction } from 'react';

import {
  Applet,
  Folder,
  GetAppletsParams,
  getWorkspaceAppletsApi,
  getWorkspaceFoldersApi,
} from 'api';
import { DEFAULT_ROWS_PER_PAGE } from 'shared/components';
import { useAsync } from 'shared/hooks';
import { workspaces } from 'shared/state';

export const useApplets = (
  setRows: Dispatch<SetStateAction<(Folder | Applet)[]>>,
  expandedFolders: string[],
) => {
  const { ownerId } = workspaces.useData() || {};

  const { execute: getWorkspaceFolders } = useAsync(getWorkspaceFoldersApi);
  const { execute: getWorkspaceApplets } = useAsync(getWorkspaceAppletsApi);

  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async (getAppletsParams?: GetAppletsParams) => {
    const {
      data: { result: folders },
    } = await getWorkspaceFolders({ ownerId: ownerId! });
    const {
      data: { result: applets },
    } = await getWorkspaceApplets(
      getAppletsParams || {
        params: {
          ownerId,
          limit: DEFAULT_ROWS_PER_PAGE,
        },
      },
    );

    let formattedApplets = [
      ...folders.map((folder) => ({ ...folder, isFolder: true })),
      ...applets.map((applet) => ({ ...applet, isFolder: false })),
    ];

    setRows(formattedApplets);

    if (!expandedFolders.length) {
      return setIsLoading(false);
    }

    setIsLoading(true);
    for await (const id of expandedFolders) {
      const {
        data: { result },
      } = await getWorkspaceApplets({
        params: {
          ownerId,
          limit: DEFAULT_ROWS_PER_PAGE,
          folderId: id,
        },
      });

      const nestedApplets = result.map((applet) => ({
        ...applet,
        isFolder: false,
        parentId: id,
      }));

      const folderIndex = formattedApplets.findIndex((row) => row.id === id);

      formattedApplets = [
        ...formattedApplets.slice(0, folderIndex + 1),
        ...nestedApplets,
        ...formattedApplets.slice(folderIndex + 1),
      ];
    }
    setRows(formattedApplets);
    setIsLoading(false);
  };

  return { fetchData, isLoading };
};

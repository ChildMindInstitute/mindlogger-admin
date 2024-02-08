import { useState, Dispatch, SetStateAction } from 'react';

import get from 'lodash.get';

import {
  Applet,
  Folder,
  GetAppletsParams,
  getWorkspaceAppletsApi,
  getWorkspaceFoldersApi,
  getWorkspaceFolderAppletsApi,
  getFilteredWorkspaceAppletsApi,
  DashboardAppletType,
} from 'api';
import { DEFAULT_ROWS_PER_PAGE } from 'shared/consts';
import { useAsync } from 'shared/hooks/useAsync';
import { workspaces } from 'shared/state';
import { getObjectFromList } from 'shared/utils';

import { getAppletsWithLocalFolders } from './Applets.utils';

export const useAppletsWithFolders = (onChangeApplets: Dispatch<SetStateAction<(Folder | Applet)[]>>) => {
  const { ownerId } = workspaces.useData() || {};

  const [count, setCount] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);

  const { execute: getWorkspaceApplets } = useAsync(getWorkspaceAppletsApi);
  const { execute: getWorkspaceFolders } = useAsync(getWorkspaceFoldersApi);
  const { execute: getWorkspaceFolderApplets } = useAsync(getWorkspaceFolderAppletsApi);
  const { execute: getFilteredWorkspaceApplets } = useAsync(getFilteredWorkspaceAppletsApi);

  const fetchData = async (getAppletsParams?: GetAppletsParams) => {
    setLoading(true);

    const { search } = getAppletsParams?.params ?? {};
    const getAppletsList = search ? getFilteredWorkspaceApplets : getWorkspaceApplets;

    const [foldersResponse, appletsResponse] = await Promise.allSettled([
      getWorkspaceFolders({ ownerId: ownerId! }),
      getAppletsList(
        getAppletsParams || {
          params: { ownerId, limit: DEFAULT_ROWS_PER_PAGE },
        },
      ),
    ]);

    const { result: folders = [] } = get(foldersResponse, ['value', 'data'], {});
    const { result: applets = [], count } = get(appletsResponse, ['value', 'data'], {});

    setCount(count);

    const appletList =
      applets?.map((applet: Applet) => ({
        ...applet,
        isFolder: applet.type === DashboardAppletType.Folder,
      })) ?? [];
    const groupedAppletList = getObjectFromList(appletList);
    const shownExpandedFolders = expandedFolders.filter(folderId => !!groupedAppletList[folderId]);

    if (search) {
      const appletsWithFolders = getAppletsWithLocalFolders(appletList ?? [], folders ?? [], expandedFolders);

      setLoading(false);

      return onChangeApplets(appletsWithFolders);
    }

    if (!shownExpandedFolders.length) {
      setLoading(false);

      return onChangeApplets(appletList);
    }

    let formattedApplets = [...appletList];

    for await (const id of shownExpandedFolders) {
      const {
        data: { result },
      } = await getWorkspaceFolderApplets({
        params: {
          ownerId,
          folderId: id,
        },
      });

      const nestedApplets = result.map(applet => ({
        ...applet,
        isFolder: false,
        parentId: id,
      }));

      const folderIndex = formattedApplets.findIndex(row => row.id === id);

      formattedApplets = [
        ...formattedApplets.slice(0, folderIndex + 1),
        ...nestedApplets,
        ...formattedApplets.slice(folderIndex + 1),
      ];
    }
    setLoading(false);

    return onChangeApplets(formattedApplets);
  };

  const expandFolder = (id: string) => {
    setExpandedFolders(prevState => [...prevState, id]);
  };
  const collapseFolder = (id: string) => setExpandedFolders(prevState => prevState.filter(folderId => folderId !== id));

  return {
    count,
    fetchData,
    isLoading,
    expandedFolders,
    expandFolder,
    collapseFolder,
  };
};

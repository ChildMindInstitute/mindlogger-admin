import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { getWorkspaceAppletsApi, Folder, Applet } from 'api';
import {
  DeletePopup,
  DuplicatePopups,
  PublishConcealAppletPopup,
  TransferOwnershipPopup,
} from 'modules/Dashboard/features/Applet/Popups';
import { popups, workspaces } from 'redux/modules';
import { ButtonWithMenu, DEFAULT_ROWS_PER_PAGE, Search, Spinner, Svg } from 'shared/components';
import { useAsync, useBreadcrumbs, useTable } from 'shared/hooks';
import { AppletContextType } from 'modules/Dashboard/features/Applets/Applets.types';

import { Table } from './Table';
import { getHeadCells, getMenuItems } from './Applets.const';
import { AppletsTableHeader, StyledButtons } from './Applets.styles';
import { generateNewFolderName } from './Applets.utils';
import { useApplets } from './Applets.hooks';

export const AppletsContext = createContext<AppletContextType | null>(null);

export const Applets = () => {
  const { t } = useTranslation('app');
  const navigate = useNavigate();

  const { ownerId } = workspaces.useData() || {};

  const {
    duplicatePopupsVisible,
    deletePopupVisible,
    transferOwnershipPopupVisible,
    publishConcealPopupVisible,
  } = popups.useData();

  const { execute: getWorkspaceApplets } = useAsync(getWorkspaceAppletsApi);

  const [rows, setRows] = useState<(Folder | Applet)[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);

  const { fetchData, isLoading } = useApplets(setRows, expandedFolders);
  const { handleSearch, searchValue, ...tableProps } = useTable(
    async (params) => await fetchData(params),
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useBreadcrumbs([
    {
      icon: 'applet-outlined',
      label: t('applets'),
    },
  ]);

  const folders = rows.filter((row) => row.isFolder) as Folder[];

  const addFolder = () => {
    const newFolderName = generateNewFolderName(folders, t);
    const folderRow = {
      appletCount: 0,
      id: (Math.random() + Math.random()).toString(),
      name: newFolderName,
      isFolder: true,
      isNew: true,
      isRenaming: true,
    };
    setRows([folderRow, ...rows]);
  };

  const headerContent = (
    <Box onClick={() => addFolder()}>
      <Svg id="add-folder" />
    </Box>
  );

  const getEmptyComponent = () => {
    if (!rows?.length) {
      if (searchValue) {
        return t('noMatchWasFound', { searchValue });
      }

      return t('noApplets');
    }
  };

  const onCloseCallback = () => {
    fetchData();
  };

  const openFolder = async (folder: Folder) => {
    const {
      data: { result: applets },
    } = await getWorkspaceApplets({
      params: {
        ownerId,
        limit: DEFAULT_ROWS_PER_PAGE,
        folderId: folder.id,
      },
    });

    const formattedApplets = applets.map((applet) => ({
      ...applet,
      isFolder: false,
      parentId: folder.id,
    }));

    const folderIndex = rows.findIndex(({ id }) => id === folder.id);

    setRows([
      ...rows.slice(0, folderIndex + 1),
      ...formattedApplets,
      ...rows.slice(folderIndex + 1),
    ]);
    setExpandedFolders([...expandedFolders, folder.id]);
  };

  const handleFolderClick = (folder: Folder) => {
    const isFolderExpanded = expandedFolders.includes(folder.id);

    if (isFolderExpanded) {
      setRows(rows.filter((row) => (row as Applet)?.parentId !== folder.id));
      setExpandedFolders(expandedFolders.filter((id) => id !== folder.id));

      return;
    }

    openFolder(folder);
  };

  useEffect(() => {
    if (!ownerId) return;
    fetchData();
  }, [ownerId]);

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <AppletsContext.Provider
          value={{
            rows,
            setRows,
            expandedFolders,
            fetchData,
            handleFolderClick,
          }}
        >
          <AppletsTableHeader>
            <StyledButtons>
              <ButtonWithMenu
                variant="outlined"
                label={t('addApplet')}
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
                menuItems={getMenuItems(() => setAnchorEl(null), navigate)}
                startIcon={<Svg width="18" height="18" id="applet-outlined" />}
              />
            </StyledButtons>
            <Search placeholder={t('searchApplets')} onSearch={handleSearch} />
          </AppletsTableHeader>
          <Table
            columns={getHeadCells()}
            rows={rows}
            headerContent={headerContent}
            emptyComponent={getEmptyComponent()}
            count={rows.length}
            {...tableProps}
          />
          {duplicatePopupsVisible && <DuplicatePopups onCloseCallback={onCloseCallback} />}
          {deletePopupVisible && <DeletePopup onCloseCallback={onCloseCallback} />}
          {transferOwnershipPopupVisible && <TransferOwnershipPopup />}
          {publishConcealPopupVisible && <PublishConcealAppletPopup />}
        </AppletsContext.Provider>
      )}
    </>
  );
};

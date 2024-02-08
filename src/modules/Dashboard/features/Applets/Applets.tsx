import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

import { Folder, Applet } from 'api';
import {
  DeletePopup,
  DuplicatePopups,
  PublishConcealAppletPopup,
  TransferOwnershipPopup,
} from 'modules/Dashboard/features/Applet/Popups';
import { auth, popups, workspaces } from 'redux/modules';
import { ButtonWithMenu, Search, Spinner, Svg } from 'shared/components';
import { useTable, useCheckIfAppletHasNotFoundError } from 'shared/hooks';
import { useAppDispatch } from 'redux/store';
import { getIsAddAppletBtnVisible } from 'shared/utils';
import { StyledBody } from 'shared/styles';

import { AppletsTable } from './AppletsTable';
import { getHeadCells, getMenuItems } from './Applets.const';
import { AppletsTableHeader, StyledButtons } from './Applets.styles';
import { generateNewFolderName } from './Applets.utils';
import { useAppletsWithFolders } from './Applets.hooks';
import { AppletsContext } from './Applets.context';

export const Applets = () => {
  const { t } = useTranslation('app');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const rolesData = workspaces.useRolesData();
  const currentWorkspace = workspaces.useData();
  const { user } = auth.useData() || {};
  const hasAppletNotFoundError = useCheckIfAppletHasNotFoundError();

  const [rows, setRows] = useState<(Folder | Applet)[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { ownerId } = workspaces.useData() || {};

  const { duplicatePopupsVisible, deletePopupVisible, transferOwnershipPopupVisible, publishConcealPopupVisible } =
    popups.useData();

  const { fetchData, isLoading, count, expandedFolders, expandFolder, collapseFolder } = useAppletsWithFolders(setRows);

  const { handleSearch, searchValue, ...tableProps } = useTable(async params => await fetchData(params));

  const folders = rows.filter(row => row.isFolder) as Folder[];

  const addFolder = () => {
    const newFolderName = generateNewFolderName(folders);
    const folderRow = {
      foldersAppletCount: 0,
      id: uuidv4(),
      displayName: newFolderName,
      isFolder: true,
      isNew: true,
      isRenaming: true,
    };
    setRows([folderRow, ...rows]);
  };

  const headerContent = (
    <Box onClick={addFolder} data-testid="dashboard-applets-add-folder">
      <Svg id="add-folder" />
    </Box>
  );

  const getEmptyComponent = () => {
    if (!rows?.length && !isLoading) {
      if (searchValue) {
        return t('noMatchWasFound', { searchValue });
      }

      return t('noApplets');
    }
  };

  const onCloseCallback = () => {
    fetchData();

    const { getWorkspaceRoles } = workspaces.thunk;
    ownerId &&
      dispatch(
        getWorkspaceRoles({
          ownerId,
        }),
      );
  };

  const openFolder = async (folder: Folder) => {
    expandFolder(folder.id);
  };

  const handleFolderClick = (folder: Folder) => {
    const isFolderExpanded = expandedFolders.includes(folder.id);

    if (isFolderExpanded) {
      setRows(rows.filter(row => (row as Applet)?.parentId !== folder.id));
      collapseFolder(folder.id);

      return;
    }

    openFolder(folder);
  };

  useEffect(() => {
    if (!ownerId) return;
    fetchData();
  }, [ownerId]);

  useEffect(() => {
    if (expandedFolders.length) tableProps.handleReload();
  }, [expandedFolders]);

  useEffect(() => {
    if (!hasAppletNotFoundError) return;
    fetchData();
  }, [hasAppletNotFoundError]);

  return (
    <StyledBody>
      {isLoading && <Spinner />}
      <AppletsContext.Provider
        value={{
          rows,
          setRows,
          expandedFolders,
          fetchData,
          reloadData: tableProps.handleReload,
          handleFolderClick,
        }}>
        <AppletsTableHeader>
          <Box>
            {getIsAddAppletBtnVisible(currentWorkspace, rolesData, user) && (
              <StyledButtons>
                <ButtonWithMenu
                  variant="outlined"
                  label={t('addApplet')}
                  anchorEl={anchorEl}
                  setAnchorEl={setAnchorEl}
                  menuItems={getMenuItems(() => setAnchorEl(null), navigate)}
                  startIcon={<Svg width="18" height="18" id="applet-outlined" />}
                  data-testid="dashboard-applets-add-applet"
                />
              </StyledButtons>
            )}
          </Box>
          <Search
            withDebounce
            placeholder={t('searchApplets')}
            onSearch={handleSearch}
            data-testid="dashboard-applets-search"
          />
        </AppletsTableHeader>
        <AppletsTable
          columns={getHeadCells()}
          rows={rows}
          headerContent={headerContent}
          emptyComponent={getEmptyComponent()}
          count={count}
          rowsPerPage={rows.length}
          data-testid="dashboard-applets-table"
          {...tableProps}
        />
        {duplicatePopupsVisible && <DuplicatePopups onCloseCallback={onCloseCallback} />}
        {deletePopupVisible && <DeletePopup onCloseCallback={onCloseCallback} data-testid="dashboard-applets-delete" />}
        {transferOwnershipPopupVisible && <TransferOwnershipPopup />}
        {publishConcealPopupVisible && <PublishConcealAppletPopup />}
      </AppletsContext.Provider>
    </StyledBody>
  );
};

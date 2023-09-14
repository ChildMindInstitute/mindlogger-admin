import { createContext, useEffect, useState } from 'react';
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
import { useBreadcrumbs, useTable } from 'shared/hooks';
import { useAppDispatch } from 'redux/store';
import { getIsAddAppletBtnVisible } from 'shared/utils';
import { StyledBody } from 'shared/styles';

import { AppletsTable } from './AppletsTable';
import { getHeadCells, getMenuItems } from './Applets.const';
import { AppletsTableHeader, StyledButtons } from './Applets.styles';
import { generateNewFolderName } from './Applets.utils';
import { useAppletsWithFolders } from './Applets.hooks';
import { AppletContextType } from './Applets.types';

export const AppletsContext = createContext<AppletContextType | null>(null);
const mockedApplet = {
  id: '2e46fa32-ea7c-4a76-b49b-1c97d795bb9a',
  displayName: 'lol',
  image: '',
  isPinned: false,
  encryption: {
    publicKey:
      '[61,30,213,174,162,231,7,138,60,189,252,133,200,126,46,221,248,99,20,44,236,54,122,36,99,234,19,86,239,145,78,16,224,164,162,173,70,1,222,109,178,222,246,8,155,183,103,34,63,83,174,175,106,42,166,14,175,58,21,152,153,242,65,246,81,138,232,37,92,10,100,61,68,61,75,37,94,202,43,43,121,87,145,144,37,134,123,162,8,230,170,246,25,253,96,43,91,0,11,106,140,126,70,59,246,145,199,90,95,9,218,127,180,122,46,0,167,193,183,164,96,53,27,104,91,232,206,65]',
    prime:
      '[142,53,84,26,33,215,174,82,178,158,65,41,36,152,127,139,197,84,90,109,103,78,94,198,149,47,225,230,115,130,194,200,81,168,101,114,98,61,177,75,5,177,145,221,227,162,65,164,108,175,141,135,195,231,15,60,128,194,133,208,69,128,254,215,114,154,198,158,109,213,187,214,158,249,206,122,105,179,103,3,182,125,47,178,49,40,174,108,200,234,147,92,166,82,149,188,194,204,56,232,83,74,155,128,101,255,174,173,116,143,235,160,156,12,125,136,25,12,107,22,160,16,138,212,164,236,224,235]',
    base: '[2]',
    accountId: '8a1f6b52-a00f-4adb-83be-461bc2e4f119',
  },
  createdAt: '2023-09-04T10:38:45.781434',
  updatedAt: '2023-09-06T14:27:03.516173',
  version: '1.2.2',
  role: 'owner',
  type: 'applet',
  foldersAppletCount: 0,
  description: {
    en: '',
  },
  activityCount: 1,
  isFolder: false,
};
export const Applets = () => {
  const { t } = useTranslation('app');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const rolesData = workspaces.useRolesData();
  const currentWorkspace = workspaces.useData();
  const { user } = auth.useData() || {};

  const [rows, setRows] = useState<(Folder | Applet)[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { ownerId } = workspaces.useData() || {};

  const {
    duplicatePopupsVisible,
    deletePopupVisible,
    transferOwnershipPopupVisible,
    publishConcealPopupVisible,
  } = popups.useData();

  const { fetchData, isLoading, count, expandedFolders, expandFolder, collapseFolder } =
    useAppletsWithFolders(setRows);

  const { handleSearch, searchValue, ...tableProps } = useTable(
    async (params) => await fetchData(params),
  );

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
    <Box onClick={() => addFolder()}>
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
      setRows(rows.filter((row) => (row as Applet)?.parentId !== folder.id));
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
        }}
      >
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
        {deletePopupVisible && (
          <DeletePopup
            testApplet={mockedApplet}
            onCloseCallback={onCloseCallback}
            data-testid="dashboard-applets-delete-popup"
          />
        )}
        {transferOwnershipPopupVisible && <TransferOwnershipPopup />}
        {publishConcealPopupVisible && <PublishConcealAppletPopup />}
      </AppletsContext.Provider>
    </StyledBody>
  );
};

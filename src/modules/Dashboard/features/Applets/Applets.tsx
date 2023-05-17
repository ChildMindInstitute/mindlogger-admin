import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { useAppDispatch } from 'redux/store';
import { auth, FolderApplet, folders } from 'redux/modules';
import { ButtonWithMenu, Search, Svg } from 'shared/components';
import { useBreadcrumbs, useTable } from 'shared/hooks';

import { Table } from './Table';
import { getHeadCells, getMenuItems } from './Applets.const';
import { AppletsTableHeader, StyledButtons } from './Applets.styles';
import { generateNewFolderName } from './Applets.utils';

export const Applets = () => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useBreadcrumbs([
    {
      icon: 'applet-outlined',
      label: t('applets'),
    },
  ]);

  const authData = auth.useData();
  const flattenItems = folders.useFlattenFoldersApplets();
  const { getWorkspaceApplets } = folders.thunk;

  const { handleSearch, searchValue, ...tableProps } = useTable((params) =>
    dispatch(getWorkspaceApplets(params)),
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const foldersApplets: FolderApplet[] = folders.useFlattenFoldersApplets();

  const addFolder = () => {
    const newFolderName = generateNewFolderName(foldersApplets, t);
    const folder = {
      id: (Math.random() + Math.random()).toString(),
      name: newFolderName,
      isFolder: true,
      description: '',
      isExpanded: false,
      items: [],
      roles: [],
      isNew: true,
      isRenaming: true,
      isVisible: true,
      depth: 0,
      parentId: String(authData?.user?.id) || '',
    };
    dispatch(folders.actions.createNewFolder(folder));
  };

  const headerContent = (
    <Box onClick={() => addFolder()}>
      <Svg id="add-folder" />
    </Box>
  );

  const getEmptyComponent = () => {
    if (!flattenItems?.length) {
      if (searchValue) {
        return t('noMatchWasFound', { searchValue });
      }

      return t('noApplets');
    }
  };

  return (
    <>
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
        rows={flattenItems}
        headerContent={headerContent}
        emptyComponent={getEmptyComponent()}
        count={flattenItems.length}
        {...tableProps}
      />
    </>
  );
};

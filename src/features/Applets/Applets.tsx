import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { useAppDispatch } from 'redux/store';
import { auth, FolderApplet, folders } from 'redux/modules';
import { ButtonWithMenu, Search, Svg } from 'components';

import { Table } from './Table/Table';
import { getHeadCells, getMenuItems } from './Applets.const';
import { StyledButtons, AppletsTableHeader } from './Applets.styles';
import { generateNewFolderName } from './Applets.utils';

export const Applets = () => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const foldersApplets: FolderApplet[] = folders.useFlattenFoldersApplets();
  const authData = auth.useData();

  const [searchValue, setSearchValue] = useState('');
  const [flattenItems, setFlattenItems] = useState<FolderApplet[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    setFlattenItems(foldersApplets);
  }, [foldersApplets]);

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

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const filterRows = (row: FolderApplet) => {
    if (!row.isVisible) return;
    if (!searchValue) {
      return row;
    }
    if (!row?.isFolder && row?.name?.toLowerCase().includes(searchValue?.toLowerCase())) {
      return row;
    } else {
      let isFolderContainsSearchApplet = false;

      row?.items?.forEach((itemInFolder) => {
        if (itemInFolder?.name?.toLowerCase().includes(searchValue.toLowerCase())) {
          isFolderContainsSearchApplet = true;
        }
      });

      if (isFolderContainsSearchApplet) {
        return row;
      }
    }
  };

  const headerContent = (
    <Box onClick={() => addFolder()}>
      <Svg id="add-folder" />
    </Box>
  );

  return (
    <>
      <AppletsTableHeader>
        <StyledButtons>
          <ButtonWithMenu
            variant="outlined"
            label={t('addApplet')}
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
            menuItems={getMenuItems(() => setAnchorEl(null))}
            startIcon={<Svg width="18" height="18" id="applet-outlined" />}
          />
        </StyledButtons>
        <Search placeholder={t('searchApplets')} onSearch={handleSearch} />
      </AppletsTableHeader>
      <Table
        columns={getHeadCells()}
        rows={flattenItems?.filter(filterRows)}
        orderBy="updated"
        headerContent={headerContent}
      />
    </>
  );
};

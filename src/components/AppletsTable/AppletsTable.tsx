import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button } from '@mui/material';

import { useAppDispatch } from 'redux/store';
import { Svg } from 'components/Svg';
import { auth, FolderApplet, folders } from 'redux/modules';
import { Search } from 'components/Search';

import { Table } from './Table';
import { getHeadCells } from './AppletsTable.const';
import { StyledButtons, AppletsTableHeader } from './AppletsTable.styles';
import { generateNewFolderName } from './AppletsTable.utils';

export const AppletsTable = (): JSX.Element => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const foldersApplets: FolderApplet[] | null = folders.useFlattenFoldersApplets();
  const authData = auth.useData();

  const [searchValue, setSearchValue] = useState('');
  const [flattenItems, setFlattenItems] = useState<FolderApplet[]>([]);

  useEffect(() => {
    setFlattenItems(foldersApplets);
  }, [foldersApplets]);

  const handleFolderClick = (folderClicked: FolderApplet) => {
    const flattenUpdated = flattenItems.map((row) => {
      if (row.id === folderClicked.id) {
        return { ...row, isExpanded: !folderClicked.isExpanded };
      }
      if (row.parentId === folderClicked.id) {
        return { ...row, isVisible: !folderClicked.isExpanded };
      }

      return row;
    });

    setFlattenItems(flattenUpdated);
  };

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
      parentId: authData?.user?.['_id'] || '',
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
          <Button
            variant="outlined"
            startIcon={<Svg width={18} height={18} id="applet-outlined" />}
          >
            {t('addApplet')}
          </Button>
        </StyledButtons>
        <Search placeholder={t('searchApplets')} onSearch={handleSearch} />
      </AppletsTableHeader>
      <Table
        columns={getHeadCells(t)}
        rows={flattenItems?.filter(filterRows)}
        onFolderClick={handleFolderClick}
        orderBy={'updated'}
        headerContent={headerContent}
      />
    </>
  );
};

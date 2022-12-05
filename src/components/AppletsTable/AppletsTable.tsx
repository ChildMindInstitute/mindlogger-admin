import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button } from '@mui/material';

import { Svg } from 'components/Svg';
import { account, FolderApplet } from 'redux/modules';
import { Search } from 'components/Search';

import { Table } from './Table';
import { getHeadCells } from './AppletsTable.const';
import { StyledButtons, AppletsTableHeader } from './AppletsTable.styles';

export const AppletsTable = (): JSX.Element => {
  const { t } = useTranslation('app');
  const currentFoldersApplets: FolderApplet[] | null = account.useFoldersApplets();

  const [searchValue, setSearchValue] = useState('');
  const [flattenItems, setFlattenItems] = useState<FolderApplet[]>([]);

  const flattenFoldersApplets = (item: FolderApplet): FolderApplet[] => {
    const folderApplet = { ...item };
    folderApplet.isNew = false;
    if (!folderApplet.depth) {
      folderApplet.depth = 0;
    }
    folderApplet.isVisible = folderApplet.depth <= 0;
    if (!folderApplet.isFolder) {
      return [folderApplet];
    }
    folderApplet.isExpanded = false;
    if (!folderApplet.items) {
      return [folderApplet];
    }
    folderApplet.items = folderApplet.items
      .map((_item) =>
        flattenFoldersApplets({
          ..._item,
          parentId: folderApplet.id,
          depth: (folderApplet.depth || 0) + 1,
        }),
      )
      .flat();

    return [folderApplet, ...folderApplet.items];
  };

  useEffect(() => {
    const flattenItems: FolderApplet[] = (currentFoldersApplets || [])
      .map((folderApplet) => flattenFoldersApplets(folderApplet))
      .flat();
    setFlattenItems(flattenItems);
  }, [currentFoldersApplets]);

  const handleRowClick = (rowClicked: FolderApplet) => {
    const flattenUpdated = flattenItems.map((row) => {
      if (row.id === rowClicked.id) {
        return { ...row, isExpanded: !rowClicked.isExpanded };
      }
      if (row.parentId === rowClicked.id) {
        return { ...row, isVisible: !rowClicked.isExpanded };
      }

      return row;
    });

    setFlattenItems(flattenUpdated);
  };

  const addFolder = () => {
    console.log('Add folder');
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
        onRowClick={handleRowClick}
        orderBy={'name'}
        headerContent={headerContent}
      />
    </>
  );
};

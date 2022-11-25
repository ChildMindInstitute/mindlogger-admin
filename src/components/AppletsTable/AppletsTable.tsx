import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button } from '@mui/material';

import { Svg } from 'components/Svg';
import { account } from 'redux/modules';
import { Search } from 'components/Search';

import { Table } from './Table';
import { Row } from './Table/Table.types';
import { headCells } from './AppletsTable.const';
import { StyledButtons, AppletsTableHeader } from './AppletsTable.styles';

export const AppletsTable = (): JSX.Element => {
  const { t } = useTranslation('app');
  const accData = account.useData();
  const [searchValue, setSearchValue] = useState('');

  const formattedRows: Row[] = [...(accData?.account?.applets || [])];

  const addFolder = () => {
    console.log('Add folder');
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const filterRows = (row: Row) => {
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
            variant="roundedOutlined"
            startIcon={<Svg width={18} height={18} id="applet-outlined" />}
          >
            {t('addApplet')}
          </Button>
        </StyledButtons>
        <Search placeholder={t('searchApplets')} onSearch={handleSearch} />
      </AppletsTableHeader>
      <Table
        columns={headCells}
        rows={formattedRows?.filter(filterRows)}
        orderBy={'name'}
        headerContent={headerContent}
      />
    </>
  );
};

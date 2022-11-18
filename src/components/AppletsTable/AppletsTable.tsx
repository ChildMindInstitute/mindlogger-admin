import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';

import { Svg } from 'components/Svg';
import { Search } from 'components/Search';
import { Table } from 'components/Table';
import { headCells, getRowsCells } from 'components/AppletsTable/mock';
import { useTimeAgo } from 'hooks';

import { AppletsTableHeader, StyledButtons } from './AppletsTable.styles';

export const AppletsTable = (): JSX.Element => {
  const { t } = useTranslation('app');
  const timeAgo = useTimeAgo();

  const rowsCells = getRowsCells(timeAgo);

  const [rows, setRows] = useState(rowsCells);

  const handleSearch = (value: string) => {
    const filteredRows = [...rowsCells].filter((row) =>
      row.appletName?.value?.toString().toLowerCase().includes(value.toLowerCase()),
    );
    setRows(filteredRows);
  };

  return (
    <>
      <AppletsTableHeader>
        <Search placeholder={t('searchApplets')} onSearch={handleSearch} />
        <StyledButtons>
          <Button variant="roundedOutlined" startIcon={<Svg width={12} height={12} id="plus" />}>
            {t('addApplet')}
          </Button>
        </StyledButtons>
      </AppletsTableHeader>
      <Table columns={headCells} rows={rows} orderBy={'appletName'} />
    </>
  );
};

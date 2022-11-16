import { useState } from 'react';
import { t } from 'i18next';

import { Search } from 'components/Search';
import { Table } from 'components/Table';
import { headCells, rowsCells } from 'components/AppletsTable/mock';

import { AppletsTableHeader, StyledButtons } from './AppletsTable.styles';

export const AppletsTable = (): JSX.Element => {
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
        <StyledButtons></StyledButtons>
      </AppletsTableHeader>

      <Table
        columns={headCells}
        rows={rows}
        orderBy={'appletName'}
        options={{ labelRowsPerPage: 'Applets' }}
      />
    </>
  );
};

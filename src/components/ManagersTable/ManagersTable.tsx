import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';

import { Svg } from 'components/Svg';
import { Search } from 'components/Search';
import { Table } from 'components/Table';
import { headCells, getRowsCells } from 'components/ManagersTable/mock';
import { useTimeAgo } from 'hooks';

import { ManagersTableHeader, StyledButtons } from './ManagersTable.styles';

export const ManagersTable = (): JSX.Element => {
  const { t } = useTranslation('app');
  const timeAgo = useTimeAgo();

  const rowsCells = getRowsCells(timeAgo);

  const [rows, setRows] = useState(rowsCells);

  const handleSearch = (value: string) => {
    // TODO filter rows
  };

  return (
    <>
      <ManagersTableHeader>
        <Search placeholder={t('searchManagers')} onSearch={handleSearch} />
        <StyledButtons>
          <Button
            variant="roundedOutlined"
            startIcon={<Svg width={14} height={14} id="settings" />}
          >
            {t('dataRetentionSettings')}
          </Button>
        </StyledButtons>
      </ManagersTableHeader>
      <Table columns={headCells} rows={rows} orderBy={'updated'} />
    </>
  );
};

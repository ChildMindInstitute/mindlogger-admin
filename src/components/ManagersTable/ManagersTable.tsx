import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';

import { Svg } from 'components/Svg';
import { Search } from 'components/Search';
import { Table } from 'components/Table';
import { useTimeAgo } from 'hooks';
import { ManagerData, users } from 'redux/modules';
import { Row } from 'components/Table';
import { filterRows } from 'utils/filterRows';
import { StyledFlexAllCenter } from 'styles/styledComponents/Flex';

import { ManagersTableHeader } from './ManagersTable.styles';
import { headCells } from './ManagersTable.const';

export const ManagersTable = (): JSX.Element => {
  const { t } = useTranslation('app');
  const timeAgo = useTimeAgo();
  const managersData = users.useManagerData();
  const [searchValue, setSearchValue] = useState('');

  const managersArr = managersData?.items
    .map((item) => Object.values(item))
    .reduce((acc: ManagerData[], currentValue) => acc.concat(currentValue), []);

  const rows = managersArr?.map(({ email, firstName, lastName, updated }) => {
    const lastEdited = updated ? timeAgo.format(new Date(updated)) : '';

    return {
      firstName: {
        content: () => firstName,
        value: firstName,
      },
      lastName: {
        content: () => lastName,
        value: lastName,
      },
      email: {
        content: () => email,
        value: email,
      },
      updated: {
        content: () => lastEdited,
        value: lastEdited,
      },
      actions: {
        content: () => '',
        value: '',
      },
    };
  });

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const handleFilterRows = (rows: Row[]) =>
    rows?.filter(
      ({ firstName, lastName, email }) =>
        filterRows(firstName, searchValue) ||
        filterRows(lastName, searchValue) ||
        filterRows(email, searchValue),
    );

  return (
    <>
      <ManagersTableHeader>
        <Search placeholder={t('searchManagers')} onSearch={handleSearch} />
        <StyledFlexAllCenter>
          <Button
            variant="roundedOutlined"
            startIcon={<Svg width={14} height={14} id="settings" />}
          >
            {t('dataRetentionSettings')}
          </Button>
        </StyledFlexAllCenter>
      </ManagersTableHeader>
      <Table columns={headCells} rows={handleFilterRows(rows as Row[])} orderBy={'updated'} />
    </>
  );
};

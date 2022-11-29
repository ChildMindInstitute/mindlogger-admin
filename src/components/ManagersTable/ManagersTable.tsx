import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { Search } from 'components/Search';
import { Table } from 'components/Table';
import { useTimeAgo } from 'hooks';
import { users } from 'redux/modules';
import { Row } from 'components/Table';
import { filterRows } from 'utils/filterRows';

import { ManagersTableHeader } from './ManagersTable.styles';
import { headCells } from './ManagersTable.const';
import { prepareManagersData, tableHeight } from './ManagersTable.utils';

export const ManagersTable = (): JSX.Element => {
  const { id } = useParams();
  const { t } = useTranslation('app');
  const timeAgo = useTimeAgo();
  const managersData = users.useManagerData();
  const [searchValue, setSearchValue] = useState('');

  const managersArr = id
    ? prepareManagersData(managersData?.items, id)
    : prepareManagersData(managersData?.items);

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
      </ManagersTableHeader>
      <Table
        tableHeight={tableHeight}
        columns={headCells}
        rows={handleFilterRows(rows as Row[])}
        orderBy={'updated'}
      />
    </>
  );
};

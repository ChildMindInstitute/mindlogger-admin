import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { Search } from 'components/Search';
import { Table, Row } from 'components/Tables';
import { Svg } from 'components/Svg';
import { breadcrumbs, ManagerData, users } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { useTimeAgo, useBaseBreadcrumbs } from 'hooks';
import { filterRows } from 'utils/filterRows';
import { prepareUsersData } from 'utils/prepareUsersData';

import { ManagersTableHeader } from './ManagersTable.styles';
import { getHeadCells } from './ManagersTable.const';
import { tableHeight } from './ManagersTable.utils';

export const ManagersTable = (): JSX.Element => {
  const { id } = useParams();
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const timeAgo = useTimeAgo();
  const managersData = users.useManagerData();
  const baseBreadcrumbs = useBaseBreadcrumbs();
  const [searchValue, setSearchValue] = useState('');

  const managersArr = (
    id ? prepareUsersData(managersData?.items, id) : prepareUsersData(managersData?.items)
  ) as ManagerData[];

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

  useEffect(() => {
    if (id && baseBreadcrumbs && baseBreadcrumbs.length > 0) {
      dispatch(
        breadcrumbs.actions.setBreadcrumbs([
          ...baseBreadcrumbs,
          {
            icon: <Svg id="manager-outlined" width="15" height="15" />,
            label: t('managers'),
          },
        ]),
      );
    }
  }, [baseBreadcrumbs, id, dispatch, t]);

  return (
    <>
      <ManagersTableHeader>
        <Search placeholder={t('searchManagers')} onSearch={handleSearch} />
      </ManagersTableHeader>
      <Table
        tableHeight={tableHeight}
        columns={getHeadCells(t)}
        rows={handleFilterRows(rows as Row[])}
        orderBy={'updated'}
      />
    </>
  );
};

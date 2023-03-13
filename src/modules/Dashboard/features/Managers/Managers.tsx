import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { Svg, Actions, Search, Table, Row } from 'shared/components';
import { ManagerData, users } from 'redux/modules';
import { useTimeAgo, useBreadcrumbs } from 'shared/hooks';
import { filterRows } from 'shared/utils/filterRows';
import { prepareUsersData } from 'shared/utils/prepareUsersData';

import { ManagersRemoveAccessPopup, EditAccessPopup } from './Popups';
import { ManagersTableHeader } from './Managers.styles';
import { getActions, getHeadCells } from './Managers.const';
import { User } from './Managers.types';

export const Managers = () => {
  const { id } = useParams();
  const { t } = useTranslation('app');
  const timeAgo = useTimeAgo();
  const managersData = users.useManagerData();
  const [searchValue, setSearchValue] = useState('');
  const [editAccessPopupVisible, setEditAccessPopupVisible] = useState(false);
  const [removeAccessPopupVisible, setRemoveAccessPopupVisible] = useState(false);
  const [selectedManager, setSelectedManager] = useState<User | null>(null);

  useBreadcrumbs([
    {
      icon: <Svg id="manager-outlined" width="15" height="15" />,
      label: t('managers'),
    },
  ]);

  const actions = {
    removeAccessAction: (user: User) => {
      setSelectedManager(user);
      setRemoveAccessPopupVisible(true);
    },
    editAccessAction: (user: User) => {
      setSelectedManager(user);
      setEditAccessPopupVisible(true);
    },
  };

  const managersArr = (
    id ? prepareUsersData(managersData?.items, id) : prepareUsersData(managersData?.items)
  ) as ManagerData[];

  const rows = managersArr?.map((user) => {
    const { email, firstName, lastName, updated, roles } = user;
    const isOwner = roles.includes('owner');
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
        content: () => <Actions items={getActions(isOwner, id, actions)} context={user} />,
        value: '',
        width: '20%',
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

  const renderEmptyComponent = () => {
    if (!rows?.length) {
      return id ? t('noManagersForApplet') : t('noManagers');
    }

    return searchValue && t('noMatchWasFound', { searchValue });
  };

  return (
    <>
      <ManagersTableHeader>
        <Search placeholder={t('searchManagers')} onSearch={handleSearch} />
      </ManagersTableHeader>
      <Table
        columns={getHeadCells()}
        rows={handleFilterRows(rows)}
        orderBy="updated"
        emptyComponent={renderEmptyComponent()}
      />
      {removeAccessPopupVisible && selectedManager && (
        <ManagersRemoveAccessPopup
          removeAccessPopupVisible={removeAccessPopupVisible}
          onClose={() => setRemoveAccessPopupVisible(false)}
          user={selectedManager}
        />
      )}
      {editAccessPopupVisible && selectedManager && (
        <EditAccessPopup
          editAccessPopupVisible={editAccessPopupVisible}
          onClose={() => setEditAccessPopupVisible(false)}
          user={selectedManager}
        />
      )}
    </>
  );
};

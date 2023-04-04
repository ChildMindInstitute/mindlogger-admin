import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { Svg, Actions, Search } from 'shared/components';
import { users } from 'redux/modules';
import { useBreadcrumbs, useTable } from 'shared/hooks';
import { Table } from 'modules/Dashboard/components';

import { ManagersRemoveAccessPopup, EditAccessPopup } from './Popups';
import { ManagersTableHeader } from './Managers.styles';
import { getActions, getHeadCells } from './Managers.const';
import { User } from './Managers.types';

export const Managers = () => {
  const { id } = useParams();
  const { t } = useTranslation('app');
  const managersData = users.useManagersData();

  const { getWorkspaceManagers } = users.thunk;

  const { searchValue, setSearchValue, ...tableProps } = useTable(getWorkspaceManagers);

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

  const rows = managersData?.result?.map((user) => {
    const { email, firstName, lastName, roles } = user;
    const stringRoles = `${roles
      ?.map((item) => item.charAt(0).toUpperCase() + item.slice(1))
      .join(', ')}`;

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
      ...(id && {
        roles: {
          content: () => stringRoles,
          value: stringRoles,
        },
      }),
      actions: {
        content: () => <Actions items={getActions(id, actions)} context={user} />,
        value: '',
        width: '20%',
      },
    };
  });

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

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
        columns={getHeadCells(id)}
        rows={rows}
        emptyComponent={renderEmptyComponent()}
        count={managersData?.count || 0}
        {...tableProps}
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

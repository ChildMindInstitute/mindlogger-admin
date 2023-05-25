import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { updateManagersPinApi } from 'api';
import { Actions, Pin, Search } from 'shared/components';
import { users, workspaces, Manager } from 'redux/modules';
import { useAsync, useBreadcrumbs, useTable } from 'shared/hooks';
import { Table } from 'modules/Dashboard/components';
import { useAppDispatch } from 'redux/store';
import { joinWihComma } from 'shared/utils';

import { ManagersRemoveAccessPopup, EditAccessPopup } from './Popups';
import { ManagersTableHeader } from './Managers.styles';
import { getActions, getHeadCells } from './Managers.const';

export const Managers = () => {
  const { appletId } = useParams();
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();

  useBreadcrumbs([
    {
      icon: 'manager-outlined',
      label: t('managers'),
    },
  ]);
  const { ownerId } = workspaces.useData() || {};
  const managersData = users.useManagersData();

  const { getWorkspaceManagers } = users.thunk;

  const { searchValue, handleSearch, handleReload, ...tableProps } = useTable((args) => {
    const params = {
      ...args,
      params: {
        ...args.params,
        ...(appletId && { appletId }),
      },
    };

    return dispatch(getWorkspaceManagers({ ...params, ...(appletId && { appletId }) }));
  });

  const [editAccessPopupVisible, setEditAccessPopupVisible] = useState(false);
  const [removeAccessPopupVisible, setRemoveAccessPopupVisible] = useState(false);
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null);

  const { execute } = useAsync(updateManagersPinApi, handleReload);

  const actions = {
    removeAccessAction: (user: Manager) => {
      setSelectedManager(user);
      setRemoveAccessPopupVisible(true);
    },
    editAccessAction: (user: Manager) => {
      setSelectedManager(user);
      setEditAccessPopupVisible(true);
    },
  };

  const handlePinClick = (userId: string) => {
    execute({ ownerId, userId });
  };

  const rows = managersData?.result?.map((user) => {
    const { email, firstName, lastName, roles, isPinned, id } = user;
    const stringRoles = joinWihComma(roles);

    return {
      pin: {
        content: () => <Pin isPinned={isPinned} />,
        value: '',
        onClick: () => handlePinClick(id),
      },
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
      ...(appletId && {
        roles: {
          content: () => stringRoles,
          value: stringRoles,
        },
      }),
      actions: {
        content: () => <Actions items={getActions(appletId, actions)} context={user} />,
        value: '',
        width: '20%',
      },
    };
  });

  const renderEmptyComponent = () => {
    if (!rows?.length) {
      return appletId ? t('noManagersForApplet') : t('noManagers');
    }

    return searchValue && t('noMatchWasFound', { searchValue });
  };

  return (
    <>
      <ManagersTableHeader>
        <Search placeholder={t('searchManagers')} onSearch={handleSearch} />
      </ManagersTableHeader>
      <Table
        columns={getHeadCells(appletId)}
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

import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { updateManagersPinApi } from 'api';
import { Actions, DEFAULT_ROWS_PER_PAGE, Pin, Search, Spinner } from 'shared/components';
import { users, workspaces, Manager } from 'redux/modules';
import { useAsync, useBreadcrumbs, usePermissions, useTable } from 'shared/hooks';
import { Table, TableProps } from 'modules/Dashboard/components';
import { useAppDispatch } from 'redux/store';
import { isManagerOrOwner, joinWihComma } from 'shared/utils';
import { Roles } from 'shared/consts';
import { StyledBody } from 'shared/styles';

import { ManagersRemoveAccessPopup, EditAccessPopup, EditAccessSuccessPopup } from './Popups';
import { ManagersTableHeader } from './Managers.styles';
import { getActions, getHeadCells } from './Managers.const';

export const Managers = () => {
  const { t } = useTranslation('app');
  const { appletId } = useParams();
  const dispatch = useAppDispatch();

  useBreadcrumbs([
    {
      icon: 'manager-outlined',
      label: t('managers'),
    },
  ]);
  const rolesData = workspaces.useRolesData();
  const { ownerId } = workspaces.useData() || {};
  const managersData = users.useManagersData();
  const loadingStatus = users.useManagersStatus();
  const isLoading = loadingStatus === 'loading' || loadingStatus === 'idle';
  const { getWorkspaceManagers } = users.thunk;

  const { isForbidden, noPermissionsComponent } = usePermissions(() =>
    dispatch(
      getWorkspaceManagers({
        params: {
          ownerId,
          limit: DEFAULT_ROWS_PER_PAGE,
          ...(appletId && { appletId }),
        },
      }),
    ),
  );

  const { searchValue, handleSearch, handleReload, ...tableProps } = useTable((args) => {
    const params = {
      ...args,
      params: {
        ...args.params,
        ...(appletId && { appletId }),
      },
    };

    return dispatch(getWorkspaceManagers(params));
  });

  const filterAppletsByRoles = (user: Manager) => ({
    ...user,
    applets: user.applets.filter((applet) => {
      const workspaceUserRole = rolesData?.data?.[applet.id]?.[0];
      const withoutManagerOrOwner = !applet.roles?.some(({ role }) => isManagerOrOwner(role));

      return (
        workspaceUserRole === Roles.Owner ||
        (workspaceUserRole === Roles.Manager && withoutManagerOrOwner)
      );
    }),
  });

  const [editAccessPopupVisible, setEditAccessPopupVisible] = useState(false);
  const [editAccessSuccessPopupVisible, setEditAccessSuccessPopupVisible] = useState(false);
  const [removeAccessPopupVisible, setRemoveAccessPopupVisible] = useState(false);
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null);

  const { execute: handlePinUpdate } = useAsync(updateManagersPinApi, handleReload);

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
    handlePinUpdate({ ownerId, userId });
  };

  const rows: TableProps['rows'] = useMemo(
    () =>
      managersData?.result?.map((user) => {
        const filteredManager = filterAppletsByRoles(user);
        const { email, firstName, lastName, roles, isPinned, id } = user;
        const stringRoles = joinWihComma(roles);

        return {
          pin: {
            content: () => <Pin isPinned={isPinned} data-testid="dashboard-managers-pin" />,
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
            content: (_, hasVisibleActions) => {
              if (ownerId === id || !filteredManager?.applets?.length) {
                return;
              }

              return (
                <Actions
                  items={getActions(actions)}
                  context={filteredManager}
                  visibleByDefault={hasVisibleActions}
                />
              );
            },
            value: '',
            width: '20%',
          },
        };
      }),
    [managersData],
  );

  const renderEmptyComponent = () => {
    if (!rows?.length && !isLoading) {
      if (searchValue) {
        return t('noMatchWasFound', { searchValue });
      }

      return appletId ? t('noManagersForApplet') : t('noManagers');
    }
  };

  useEffect(
    () => () => {
      dispatch(users.actions.resetManagersData());
    },
    [],
  );

  if (isForbidden) return noPermissionsComponent;

  return (
    <StyledBody>
      {isLoading && <Spinner />}
      <ManagersTableHeader>
        <Search
          placeholder={t('searchManagers')}
          onSearch={handleSearch}
          data-testid="dashboard-managers-search"
        />
      </ManagersTableHeader>
      <Table
        columns={getHeadCells(appletId)}
        rows={rows}
        emptyComponent={renderEmptyComponent()}
        count={managersData?.count || 0}
        data-testid="dashboard-managers-table"
        {...tableProps}
      />
      {selectedManager && (
        <>
          {removeAccessPopupVisible && (
            <ManagersRemoveAccessPopup
              removeAccessPopupVisible={removeAccessPopupVisible}
              onClose={() => setRemoveAccessPopupVisible(false)}
              user={selectedManager}
              refetchManagers={handleReload}
            />
          )}
          {editAccessPopupVisible && (
            <EditAccessPopup
              editAccessPopupVisible={editAccessPopupVisible}
              setEditAccessSuccessPopupVisible={setEditAccessSuccessPopupVisible}
              onClose={() => setEditAccessPopupVisible(false)}
              user={selectedManager}
              reFetchManagers={handleReload}
            />
          )}
          {editAccessSuccessPopupVisible && (
            <EditAccessSuccessPopup
              open={editAccessSuccessPopupVisible}
              onClose={() => setEditAccessSuccessPopupVisible(false)}
              {...selectedManager}
            />
          )}
        </>
      )}
    </StyledBody>
  );
};

import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { getWorkspaceManagersApi, updateManagersPinApi } from 'api';
import { Actions, Pin, Search, Spinner } from 'shared/components';
import { banners, workspaces } from 'redux/modules';
import { useAsync, usePermissions, useTable } from 'shared/hooks';
import { DashboardTable, DashboardTableProps } from 'modules/Dashboard/components';
import { Manager } from 'modules/Dashboard/types';
import { isManagerOrOwner, joinWihComma } from 'shared/utils';
import { Roles, DEFAULT_ROWS_PER_PAGE } from 'shared/consts';
import { StyledBody } from 'shared/styles';
import { useAppDispatch } from 'redux/store';

import { ManagersRemoveAccessPopup, EditAccessPopup } from './Popups';
import { ManagersTableHeader } from './Managers.styles';
import { getActions, getHeadCells, ManagersColumnsWidth } from './Managers.const';
import { ManagersData } from './Managers.types';

export const Managers = () => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const { appletId } = useParams();
  const [managersData, setManagersData] = useState<ManagersData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const rolesData = workspaces.useRolesData();
  const { ownerId } = workspaces.useData() || {};

  const { execute: getWorkspaceManagers } = useAsync(
    getWorkspaceManagersApi,
    (response) => {
      setManagersData(response?.data || null);
    },
    undefined,
    () => setIsLoading(false),
  );

  const { isForbidden, noPermissionsComponent } = usePermissions(() => {
    setIsLoading(true);

    return getWorkspaceManagers({
      params: {
        ownerId,
        limit: DEFAULT_ROWS_PER_PAGE,
        ...(appletId && { appletId }),
      },
    });
  });

  const { searchValue, handleSearch, handleReload, ...tableProps } = useTable((args) => {
    setIsLoading(true);
    const params = {
      ...args,
      params: {
        ...args.params,
        ...(appletId && { appletId }),
      },
    };

    return getWorkspaceManagers(params);
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
  const [removeAccessPopupVisible, setRemoveAccessPopupVisible] = useState(false);
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null);

  const { execute: handlePinUpdate } = useAsync(updateManagersPinApi, handleReload, undefined, () =>
    setIsLoading(false),
  );

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
    setIsLoading(true);
    handlePinUpdate({ ownerId, userId });
  };

  const removeManagerAccessOnClose = (step?: number) => {
    setRemoveAccessPopupVisible(false);
    step === 2 && handleReload();
  };

  const editManagerAccessOnClose = (shouldRefetch?: boolean) => {
    setEditAccessPopupVisible(false);
    if (shouldRefetch) {
      dispatch(banners.actions.addBanner({ key: 'SaveSuccessBanner' }));
      handleReload();
    }
  };

  const rows: DashboardTableProps['rows'] = useMemo(
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
            width: ManagersColumnsWidth.Pin,
          },
          firstName: {
            content: () => firstName,
            value: firstName,
            width: ManagersColumnsWidth.FirstName,
          },
          lastName: {
            content: () => lastName,
            value: lastName,
            width: ManagersColumnsWidth.LastName,
          },
          email: {
            content: () => email,
            value: email,
            width: ManagersColumnsWidth.Email,
          },
          ...(appletId && {
            roles: {
              content: () => stringRoles,
              value: stringRoles,
              width: ManagersColumnsWidth.Roles,
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
                  data-testid="dashboard-managers-table-actions"
                />
              );
            },
            value: '',
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
      setManagersData(null);
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
      <DashboardTable
        columns={getHeadCells(appletId)}
        rows={rows}
        emptyComponent={renderEmptyComponent()}
        count={managersData?.count || 0}
        hasColFixedWidth
        data-testid="dashboard-managers-table"
        {...tableProps}
      />
      {selectedManager && (
        <>
          {removeAccessPopupVisible && (
            <ManagersRemoveAccessPopup
              popupVisible={removeAccessPopupVisible}
              onClose={removeManagerAccessOnClose}
              user={selectedManager}
            />
          )}
          {editAccessPopupVisible && (
            <EditAccessPopup
              popupVisible={editAccessPopupVisible}
              onClose={editManagerAccessOnClose}
              user={selectedManager}
            />
          )}
        </>
      )}
    </StyledBody>
  );
};

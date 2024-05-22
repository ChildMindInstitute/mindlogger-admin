import { useEffect, useMemo, useState } from 'react';
import { Avatar as MuiAvatar, Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { getWorkspaceInfoApi, getWorkspaceManagersApi } from 'api';
import {
  ActionsMenu,
  Avatar,
  AvatarUiType,
  Chip,
  MenuActionProps,
  Search,
  Spinner,
} from 'shared/components';
import { banners, workspaces } from 'redux/modules';
import { StyledMaybeEmpty } from 'shared/styles/styledComponents/MaybeEmpty';
import { useAsync, usePermissions, useTable } from 'shared/hooks';
import { DashboardTable, DashboardTableProps } from 'modules/Dashboard/components';
import { Manager, WorkspaceInfo } from 'modules/Dashboard/types';
import { isManagerOrOwner, joinWihComma } from 'shared/utils';
import { Roles, DEFAULT_ROWS_PER_PAGE } from 'shared/consts';
import { StyledBody, StyledFlexWrap, variables } from 'shared/styles';
import { useAppDispatch } from 'redux/store';

import { AddManagerPopup, ManagersRemoveAccessPopup, EditAccessPopup } from './Popups';
import { ManagersData } from './Managers.types';
import { getManagerActions, getHeadCells } from './Managers.utils';

export const Managers = () => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const { appletId } = useParams();
  const [managersData, setManagersData] = useState<ManagersData | null>(null);
  const [workspaceInfo, setWorkspaceInfo] = useState<WorkspaceInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const dataTestId = 'dashboard-managers';

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
  const { execute: executeGetWorkspaceInfoApi } = useAsync(getWorkspaceInfoApi, (res) => {
    setWorkspaceInfo(res?.data?.result || null);
  });

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

  const [addManagerPopupVisible, setAddManagerPopupVisible] = useState(false);
  const [editAccessPopupVisible, setEditAccessPopupVisible] = useState(false);
  const [removeAccessPopupVisible, setRemoveAccessPopupVisible] = useState(false);
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null);

  const actions = {
    removeAccessAction: ({ context: user }: MenuActionProps<Manager>) => {
      setSelectedManager(user || null);
      setRemoveAccessPopupVisible(true);
    },
    editAccessAction: ({ context: user }: MenuActionProps<Manager>) => {
      setSelectedManager(user || null);
      setEditAccessPopupVisible(true);
    },
  };

  const addManagerOnClose = (shouldRefetch?: boolean) => {
    setAddManagerPopupVisible(false);
    shouldRefetch && handleReload();
  };

  const removeManagerAccessOnClose = (step?: number) => {
    setRemoveAccessPopupVisible(false);
    step === 3 && handleReload();
  };

  const editManagerAccessOnClose = (shouldReFetch?: boolean) => {
    setEditAccessPopupVisible(false);
    if (shouldReFetch) {
      dispatch(banners.actions.addBanner({ key: 'SaveSuccessBanner' }));
      handleReload();
    }
  };

  const rows: DashboardTableProps['rows'] = useMemo(
    () =>
      managersData?.result?.map((user) => {
        const filteredManager = filterAppletsByRoles(user);
        const { applets, email, firstName, lastName, title, roles, id } = user;
        const stringRoles = joinWihComma(roles);
        const appletRole = applets.find(({ id }) => id === appletId);
        const renderedRoles = appletRole?.roles.map(({ role }) => (
          <Chip
            color="secondary"
            key={role}
            title={`${role.charAt(0).toLocaleUpperCase()}${role.slice(1)}`}
          />
        ));

        return {
          avatar: {
            content: () => (
              <MuiAvatar
                sx={{
                  background: variables.palette.primary_container,
                  width: '3.2rem',
                  height: '3.2rem',
                }}
              >
                <Avatar
                  caption={`${firstName[0] ?? '?'}${lastName[0] ?? '?'}`.toLocaleUpperCase()}
                  uiType={AvatarUiType.Primary}
                />
              </MuiAvatar>
            ),
            value: '',
            width: '8rem',
          },
          firstName: {
            content: () => <StyledMaybeEmpty>{firstName}</StyledMaybeEmpty>,
            value: firstName,
          },
          lastName: {
            content: () => <StyledMaybeEmpty>{lastName}</StyledMaybeEmpty>,
            value: lastName,
          },
          title: {
            content: () => <StyledMaybeEmpty>{title}</StyledMaybeEmpty>,
            value: title ?? '',
          },
          ...(appletId && {
            roles: {
              content: () => <StyledMaybeEmpty>{renderedRoles}</StyledMaybeEmpty>,
              value: stringRoles,
            },
          }),
          email: {
            content: () => <StyledMaybeEmpty>{email}</StyledMaybeEmpty>,
            value: email,
          },
          actions: {
            content: () => {
              if (ownerId === id || !filteredManager?.applets?.length) {
                return;
              }

              return (
                <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'flex-end' }}>
                  <ActionsMenu
                    buttonColor="secondary"
                    data-testid={`${dataTestId}-table-actions`}
                    menuItems={getManagerActions(actions, filteredManager)}
                  />
                </Box>
              );
            },
            value: '',
            width: '8rem',
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

  useEffect(() => {
    if (!ownerId) return;
    if (!appletId) return;

    executeGetWorkspaceInfoApi({ ownerId });
  }, [ownerId, appletId, executeGetWorkspaceInfoApi]);

  if (isForbidden) return noPermissionsComponent;

  return (
    <StyledBody sx={{ p: 3.2 }}>
      {isLoading && <Spinner />}

      <StyledFlexWrap sx={{ gap: 1.2, mb: 2.4 }}>
        {/* TODO: Add sorting/filtering (https://mindlogger.atlassian.net/browse/M2-5608) */}

        <StyledFlexWrap sx={{ gap: 1.2, ml: 'auto' }}>
          <Search
            withDebounce
            placeholder={t('searchTeam')}
            onSearch={handleSearch}
            sx={{ width: '32rem' }}
            data-testid={`${dataTestId}-search`}
          />

          {!!appletId && (
            <Button
              variant="contained"
              onClick={() => setAddManagerPopupVisible(true)}
              data-testid={`${dataTestId}-add`}
            >
              {t('addTeamMember')}
            </Button>
          )}
        </StyledFlexWrap>
      </StyledFlexWrap>

      <DashboardTable
        columns={getHeadCells(appletId)}
        rows={rows}
        emptyComponent={renderEmptyComponent()}
        count={managersData?.count || 0}
        data-testid={`${dataTestId}-table`}
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
      {addManagerPopupVisible && appletId && (
        <AddManagerPopup
          popupVisible={addManagerPopupVisible}
          onClose={addManagerOnClose}
          appletId={appletId}
          workspaceInfo={workspaceInfo}
        />
      )}
    </StyledBody>
  );
};

import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate, useParams } from 'react-router-dom';

import { ActionsMenu, MenuActionProps, Pin, Row, Search, Spinner, Svg } from 'shared/components';
import { workspaces } from 'redux/modules';
import { useAsync, useEncryptionStorage, usePermissions, useTable, useTimeAgo } from 'shared/hooks';
import { DashboardTable } from 'modules/Dashboard/components';
import { getWorkspaceRespondentsApi, updateRespondentsPinApi } from 'api';
import { page } from 'resources';
import { getDateInUserTimezone, isManagerOrOwner, joinWihComma, Mixpanel } from 'shared/utils';
import { DEFAULT_ROWS_PER_PAGE, Roles } from 'shared/consts';
import { StyledBody } from 'shared/styles';
import { Respondent, RespondentStatus } from 'modules/Dashboard/types';

import {
  RespondentsTableHeader,
  StyledButton,
  StyledLeftBox,
  StyledRightBox,
} from './Respondents.styles';
import { getAppletsSmallTableRows, getHeadCells, getRespondentActions } from './Respondents.utils';
import { RespondentsColumnsWidth } from './Respondents.const';
import {
  ChosenAppletData,
  FilteredApplets,
  FilteredRespondents,
  RespondentActionProps,
  RespondentsData,
} from './Respondents.types';
import {
  DataExportPopup,
  EditRespondentPopup,
  RespondentsRemoveAccessPopup,
  ScheduleSetupPopup,
  SendInvitationPopup,
  ViewDataPopup,
} from './Popups';
import { StatusFlag } from './StatusFlag';

export const Respondents = () => {
  const { appletId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation('app');
  const timeAgo = useTimeAgo();

  const [respondentsData, setRespondentsData] = useState<RespondentsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const rolesData = workspaces.useRolesData();
  const { ownerId } = workspaces.useData() || {};

  const { execute: getWorkspaceRespondents } = useAsync(
    getWorkspaceRespondentsApi,
    (response) => {
      setRespondentsData(response?.data || null);
    },
    undefined,
    () => setIsLoading(false),
  );

  const { isForbidden, noPermissionsComponent } = usePermissions(() => {
    setIsLoading(true);

    return getWorkspaceRespondents({
      params: {
        ownerId,
        limit: DEFAULT_ROWS_PER_PAGE,
        ...(appletId && { appletId }),
      },
    });
  });

  const { searchValue, handleSearch, ordering, handleReload, ...tableProps } = useTable((args) => {
    setIsLoading(true);
    const params = {
      ...args,
      params: {
        ...args.params,
        ...(appletId && { appletId }),
      },
    };

    return getWorkspaceRespondents(params);
  });

  const [scheduleSetupPopupVisible, setScheduleSetupPopupVisible] = useState(false);
  const [dataExportPopupVisible, setDataExportPopupVisible] = useState(false);
  const [viewDataPopupVisible, setViewDataPopupVisible] = useState(false);
  const [removeAccessPopupVisible, setRemoveAccessPopupVisible] = useState(false);
  const [editRespondentPopupVisible, setEditRespondentPopupVisible] = useState(false);
  const [respondentKey, setRespondentKey] = useState<null | string>(null);
  const [chosenAppletData, setChosenAppletData] = useState<null | ChosenAppletData>(null);
  const [invitationPopupVisible, setInvitationPopupVisible] = useState(false);
  const [respondentEmail, setRespondentEmail] = useState<null | string>(null);

  const { getAppletPrivateKey } = useEncryptionStorage();
  const hasEncryptionCheck = !!getAppletPrivateKey(appletId ?? '');

  const handleSetDataForAppletPage = (respondentId: string, key: keyof FilteredApplets) => {
    if (respondentId && appletId && ownerId) {
      const respondentAccess = filteredRespondents[respondentId]?.[key]?.[0];
      const chosenAppletData = respondentAccess && {
        ...respondentAccess,
        respondentId,
        ownerId,
      };
      setChosenAppletData(chosenAppletData ?? null);
    }
  };

  const handleInviteClick = (respondentId: string, email: string | null) => {
    setRespondentKey(respondentId);
    setRespondentEmail(email);
    handleSetDataForAppletPage(respondentId, 'editable');
    setInvitationPopupVisible(true);
  };

  const actions = {
    scheduleSetupAction: ({ context }: MenuActionProps<RespondentActionProps>) => {
      const { respondentId } = context || {};
      if (!respondentId) return;

      setRespondentKey(respondentId);
      handleSetDataForAppletPage(respondentId, 'scheduling');
      setScheduleSetupPopupVisible(true);
    },
    userDataExportAction: ({ context }: MenuActionProps<RespondentActionProps>) => {
      const { respondentId } = context || {};
      if (!respondentId) return;

      setRespondentKey(respondentId);
      handleSetDataForAppletPage(respondentId, 'viewable');
      setDataExportPopupVisible(true);
      Mixpanel.track('Export Data click');
    },
    viewDataAction: ({ context }: MenuActionProps<RespondentActionProps>) => {
      const { respondentId } = context || {};
      if (!respondentId) return;

      if (hasEncryptionCheck && appletId) {
        respondentId &&
          navigate(generatePath(page.appletRespondentDataSummary, { appletId, respondentId }));

        return;
      }
      handleSetDataForAppletPage(respondentId, 'viewable');
      setRespondentKey(respondentId);
      setViewDataPopupVisible(true);
    },
    removeAccessAction: ({ context }: MenuActionProps<RespondentActionProps>) => {
      const { respondentId } = context || {};
      if (!respondentId) return;

      setRespondentKey(respondentId);
      handleSetDataForAppletPage(respondentId, 'editable');
      setRemoveAccessPopupVisible(true);
    },
    editRespondent: ({ context }: MenuActionProps<RespondentActionProps>) => {
      const { respondentId } = context || {};
      if (!respondentId) return;

      setRespondentKey(respondentId);
      handleSetDataForAppletPage(respondentId, 'editable');
      setEditRespondentPopupVisible(true);
    },
    sendInvitation: ({ context }: MenuActionProps<RespondentActionProps>) => {
      const { respondentId, email = null } = context || {};
      if (!respondentId) return;

      handleInviteClick(respondentId, email);
    },
  };

  const { execute: updateRespondentsPin } = useAsync(
    updateRespondentsPinApi,
    handleReload,
    undefined,
    () => setIsLoading(false),
  );

  const handlePinClick = (userId: string) => {
    setIsLoading(true);
    updateRespondentsPin({ ownerId, userId });
  };

  const editRespondentOnClose = (shouldReFetch: boolean) => {
    setEditRespondentPopupVisible(false);
    setChosenAppletData(null);
    shouldReFetch && handleReload();
  };

  const removeRespondentAccessOnClose = (shouldReFetch?: boolean) => {
    setRemoveAccessPopupVisible(false);
    setChosenAppletData(null);
    shouldReFetch && handleReload();
  };

  const handleInvitationPopupClose = (shouldReFetch?: boolean) => {
    setInvitationPopupVisible(false);
    setRespondentEmail(null);
    shouldReFetch && handleReload();
  };

  const formatRow = (user: Respondent): Row => {
    const {
      secretIds,
      nicknames,
      lastSeen,
      id,
      details,
      isPinned,
      isAnonymousRespondent,
      status,
      email,
    } = user;
    const latestActive = lastSeen ? timeAgo.format(getDateInUserTimezone(lastSeen)) : '';
    const schedule =
      appletId && details?.[0]?.hasIndividualSchedule ? t('individual') : t('default');
    const stringNicknames = joinWihComma(nicknames, true);
    const stringSecretIds = joinWihComma(secretIds, true);

    return {
      pin: {
        content: () => <Pin isPinned={isPinned} data-testid="dashboard-respondents-pin" />,
        value: '',
        onClick: () => handlePinClick(id),
        width: RespondentsColumnsWidth.Pin,
      },
      secretIds: {
        content: () => stringSecretIds,
        value: stringSecretIds,
        width: RespondentsColumnsWidth.Default,
      },
      nicknames: {
        content: () => stringNicknames,
        value: stringNicknames,
        width: RespondentsColumnsWidth.Default,
      },
      lastSeen: {
        content: () => latestActive,
        value: latestActive,
        width: RespondentsColumnsWidth.Default,
      },
      ...(appletId && {
        schedule: {
          content: () => schedule,
          value: schedule,
          width: RespondentsColumnsWidth.Schedule,
        },
      }),
      status: {
        content: () =>
          status !== RespondentStatus.Invited && (
            <StatusFlag
              status={status}
              onInviteClick={() => handleInviteClick(id, email)}
              isInviteDisabled={!filteredRespondents?.[id]?.editable.length}
            />
          ),
        value: '',
        width: RespondentsColumnsWidth.Status,
      },
      actions: {
        content: () => (
          <ActionsMenu
            menuItems={getRespondentActions({
              actions,
              filteredApplets: filteredRespondents?.[id],
              isAnonymousRespondent,
              respondentId: id,
              appletId,
              email,
              isInviteEnabled: status === RespondentStatus.NotInvited,
            })}
            data-testid="dashboard-respondents-table-actions"
          />
        ),
        value: '',
      },
    };
  };

  const filterRespondentApplets = (user: Respondent) => {
    const { details } = user;
    const filteredApplets: FilteredApplets = {
      scheduling: [],
      editable: [],
      viewable: [],
    };
    const { editable, viewable, scheduling } = filteredApplets;

    for (const detail of details) {
      const appletRoles = rolesData?.data?.[detail.appletId];
      if (isManagerOrOwner(appletRoles?.[0])) {
        editable.push(detail);
        viewable.push(detail);
        scheduling.push(detail);
        continue;
      }
      if (appletRoles?.includes(Roles.Reviewer)) {
        viewable.push(detail);
      }
      if (appletRoles?.includes(Roles.Coordinator)) {
        scheduling.push(detail);
        editable.push(detail);
      }
    }

    return filteredApplets;
  };

  const { rows, filteredRespondents }: { filteredRespondents: FilteredRespondents; rows?: Row[] } =
    useMemo(
      () =>
        respondentsData?.result?.reduce(
          (acc: { filteredRespondents: FilteredRespondents; rows: Row[] }, user) => {
            acc.filteredRespondents[user.id] = filterRespondentApplets(user);
            acc.rows.push(formatRow(user));

            return acc;
          },
          { rows: [], filteredRespondents: {} },
        ) || { rows: undefined, filteredRespondents: {} },
      [respondentsData, t],
    );

  useEffect(
    () => () => {
      setRespondentsData(null);
    },
    [],
  );

  const chosenRespondentsItems = respondentKey ? filteredRespondents[respondentKey] : undefined;

  const getAppletsSmallTable = (key: keyof FilteredApplets) =>
    chosenRespondentsItems?.[key] && ownerId && respondentKey
      ? getAppletsSmallTableRows(
          chosenRespondentsItems[key],
          setChosenAppletData,
          respondentKey,
          ownerId,
        )
      : undefined;

  const viewableAppletsSmallTableRows = getAppletsSmallTable('viewable');
  const editableAppletsSmallTableRows = getAppletsSmallTable('editable');
  const schedulingAppletsSmallTableRows = getAppletsSmallTable('scheduling');

  const renderEmptyComponent = () => {
    if (!rows?.length && !isLoading) {
      if (searchValue) {
        return t('noMatchWasFound', { searchValue });
      }

      return appletId ? t('noRespondentsForApplet') : t('noRespondents');
    }
  };

  if (isForbidden) return noPermissionsComponent;

  return (
    <StyledBody>
      {isLoading && <Spinner />}
      <RespondentsTableHeader hasButton={!!appletId}>
        {appletId && (
          <StyledLeftBox>
            <StyledButton
              variant="outlined"
              startIcon={<Svg width={18} height={18} id="respondent-outlined" />}
              onClick={() => navigate(generatePath(page.appletAddUser, { appletId }))}
              data-testid="dashboard-respondents-add"
            >
              {t('addRespondent')}
            </StyledButton>
          </StyledLeftBox>
        )}
        <Search
          withDebounce
          placeholder={t('searchRespondents')}
          onSearch={handleSearch}
          data-testid="dashboard-respondents-search"
        />
        {appletId && <StyledRightBox />}
      </RespondentsTableHeader>
      <DashboardTable
        columns={getHeadCells(appletId)}
        rows={rows}
        emptyComponent={renderEmptyComponent()}
        count={respondentsData?.count || 0}
        hasColFixedWidth
        data-testid="dashboard-respondents-table"
        {...tableProps}
      />
      {scheduleSetupPopupVisible && (
        <ScheduleSetupPopup
          popupVisible={scheduleSetupPopupVisible}
          setPopupVisible={setScheduleSetupPopupVisible}
          tableRows={schedulingAppletsSmallTableRows}
          chosenAppletData={chosenAppletData}
          setChosenAppletData={setChosenAppletData}
        />
      )}
      {viewDataPopupVisible && (
        <ViewDataPopup
          popupVisible={viewDataPopupVisible}
          setPopupVisible={setViewDataPopupVisible}
          tableRows={viewableAppletsSmallTableRows}
          chosenAppletData={chosenAppletData}
          setChosenAppletData={setChosenAppletData}
        />
      )}
      {removeAccessPopupVisible && (
        <RespondentsRemoveAccessPopup
          popupVisible={removeAccessPopupVisible}
          onClose={removeRespondentAccessOnClose}
          chosenAppletData={chosenAppletData}
          tableRows={editableAppletsSmallTableRows}
        />
      )}
      {dataExportPopupVisible && (
        <DataExportPopup
          popupVisible={dataExportPopupVisible}
          setPopupVisible={setDataExportPopupVisible}
          tableRows={viewableAppletsSmallTableRows}
          chosenAppletData={chosenAppletData}
          setChosenAppletData={setChosenAppletData}
          data-testid="dashboard-respondents-export-data-popup"
        />
      )}
      {editRespondentPopupVisible && (
        <EditRespondentPopup
          popupVisible={editRespondentPopupVisible}
          onClose={editRespondentOnClose}
          chosenAppletData={chosenAppletData}
        />
      )}
      {invitationPopupVisible && (
        <SendInvitationPopup
          popupVisible={invitationPopupVisible}
          onClose={handleInvitationPopupClose}
          email={respondentEmail}
          chosenAppletData={chosenAppletData}
          setChosenAppletData={setChosenAppletData}
          tableRows={editableAppletsSmallTableRows}
        />
      )}
    </StyledBody>
  );
};

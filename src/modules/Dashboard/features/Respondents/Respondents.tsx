import { Button } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, generatePath, useNavigate, useParams } from 'react-router-dom';

import { EmptyDashboardTable } from 'modules/Dashboard/components/EmptyDashboardTable';
import {
  ActionsMenu,
  Chip,
  MenuActionProps,
  Pin,
  Row,
  Search,
  Spinner,
  Svg,
} from 'shared/components';
import { workspaces } from 'redux/modules';
import { useAsync, usePermissions, useTable, useTimeAgo } from 'shared/hooks';
import { DashboardTable } from 'modules/Dashboard/components';
import {
  GetAppletsParams,
  getWorkspaceRespondentsApi,
  updateRespondentsPinApi,
  updateSubjectsPinApi,
} from 'api';
import { page } from 'resources';
import {
  checkIfCanManageParticipants,
  checkIfCanViewParticipants,
  getDateInUserTimezone,
  joinWihComma,
  Mixpanel,
  MixpanelEventType,
  MixpanelProps,
} from 'shared/utils';
import { DEFAULT_ROWS_PER_PAGE } from 'shared/consts';
import { StyledBody } from 'shared/styles';
import { Participant, ParticipantStatus, ParticipantWithDataAccess } from 'modules/Dashboard/types';

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
  FilteredAppletsKey,
  FilteredRespondents,
  HandleInviteClick,
  HandlePinClick,
  RespondentActionProps,
  SetDataForAppletPage,
} from './Respondents.types';
import {
  DataExportPopup,
  EditRespondentPopup,
  RemoveRespondentPopup,
  ScheduleSetupPopup,
  SendInvitationPopup,
  ViewParticipantPopup,
} from './Popups';
import { ParticipantsDataWithDataAccess } from '../Participants';

export const Respondents = () => {
  const { appletId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation('app');
  const timeAgo = useTimeAgo();

  const [respondentsData, setRespondentsData] = useState<ParticipantsDataWithDataAccess | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);

  const rolesData = workspaces.useRolesData();
  const { ownerId } = workspaces.useData() || {};
  const roles =
    appletId && rolesData?.data
      ? rolesData?.data?.[appletId]
      : [...new Set(Object.values(rolesData.data || []).flat())];
  const canViewParticipants = checkIfCanViewParticipants(roles);

  const { execute } = useAsync(
    getWorkspaceRespondentsApi,
    (response) => {
      setRespondentsData(response?.data || null);
    },
    undefined,
    () => setIsLoading(false),
  );

  const getWorkspaceRespondents = (args?: GetAppletsParams) => {
    setIsLoading(true);

    // Always sort by pinned first
    const ordering = ['-isPinned'];
    ordering.push(args?.params.ordering ?? '+tags,+secretIds');

    return execute({
      ...args,
      params: {
        ownerId,
        limit: DEFAULT_ROWS_PER_PAGE,
        ...(appletId && { appletId }),
        ...args?.params,
        ordering: ordering.join(','),
      },
    });
  };

  const { isForbidden, noPermissionsComponent } = usePermissions(() => {
    if (!canViewParticipants) return;

    return getWorkspaceRespondents();
  });

  const { searchValue, handleSearch, handleReload, ...tableProps } = useTable(
    getWorkspaceRespondents,
    DEFAULT_ROWS_PER_PAGE,
    'tags',
    'asc',
  );

  const [scheduleSetupPopupVisible, setScheduleSetupPopupVisible] = useState(false);
  const [dataExportPopupVisible, setDataExportPopupVisible] = useState(false);
  const [viewDataPopupVisible, setViewDataPopupVisible] = useState(false);
  const [removeAccessPopupVisible, setRemoveAccessPopupVisible] = useState(false);
  const [editRespondentPopupVisible, setEditRespondentPopupVisible] = useState(false);
  const [respondentKey, setRespondentKey] = useState<null | string>(null);
  const [chosenAppletData, setChosenAppletData] = useState<null | ChosenAppletData>(null);
  const [invitationPopupVisible, setInvitationPopupVisible] = useState(false);
  const [respondentEmail, setRespondentEmail] = useState<null | string>(null);

  const getChosenAppletData = ({
    respondentId = null,
    respondentOrSubjectId,
    key,
  }: SetDataForAppletPage) => {
    if (!ownerId) return;
    const respondentAccess = filteredRespondents[respondentOrSubjectId]?.[key]?.[0];

    return (
      respondentAccess && {
        ...respondentAccess,
        respondentId,
        ownerId,
      }
    );
  };

  const handleSetDataForAppletPage = ({
    respondentId = null,
    respondentOrSubjectId,
    key,
  }: SetDataForAppletPage) => {
    if (!appletId) return;

    const chosenAppletData = getChosenAppletData({ respondentId, respondentOrSubjectId, key });
    setChosenAppletData(chosenAppletData ?? null);
  };

  const handleInviteClick = ({ respondentOrSubjectId, email }: HandleInviteClick) => {
    setRespondentKey(respondentOrSubjectId);
    setRespondentEmail(email);
    handleSetDataForAppletPage({
      respondentOrSubjectId,
      key: FilteredAppletsKey.Editable,
    });
    setInvitationPopupVisible(true);
  };

  const actions = {
    scheduleSetupAction: ({ context }: MenuActionProps<RespondentActionProps>) => {
      const { respondentId, respondentOrSubjectId } = context || {};
      if (!respondentId || !respondentOrSubjectId) return;

      setRespondentKey(respondentOrSubjectId);
      handleSetDataForAppletPage({
        respondentId,
        respondentOrSubjectId,
        key: FilteredAppletsKey.Scheduling,
      });
      setScheduleSetupPopupVisible(true);
    },
    userDataExportAction: ({ context }: MenuActionProps<RespondentActionProps>) => {
      const { respondentOrSubjectId } = context || {};
      if (!respondentOrSubjectId) return;

      setRespondentKey(respondentOrSubjectId);
      handleSetDataForAppletPage({ respondentOrSubjectId, key: FilteredAppletsKey.Viewable });
      setDataExportPopupVisible(true);
      Mixpanel.track({
        action: MixpanelEventType.ExportDataClick,
        [MixpanelProps.AppletId]: appletId,
      });
    },
    viewDataAction: ({ context }: MenuActionProps<RespondentActionProps>) => {
      const { respondentOrSubjectId } = context || {};
      if (!respondentOrSubjectId) return;

      if (appletId) {
        const chosenAppletData = getChosenAppletData({
          respondentOrSubjectId,
          key: FilteredAppletsKey.Viewable,
        });

        navigate(
          generatePath(page.appletParticipantDetails, {
            appletId,
            subjectId: chosenAppletData?.subjectId,
          }),
        );

        return;
      }

      handleSetDataForAppletPage({
        respondentOrSubjectId,
        key: FilteredAppletsKey.Viewable,
      });
      setRespondentKey(respondentOrSubjectId);
      setViewDataPopupVisible(true);
    },
    removeAccessAction: ({ context }: MenuActionProps<RespondentActionProps>) => {
      const { respondentOrSubjectId } = context || {};
      if (!respondentOrSubjectId) return;

      setRespondentKey(respondentOrSubjectId);
      handleSetDataForAppletPage({
        respondentOrSubjectId,
        key: FilteredAppletsKey.Editable,
      });
      setRemoveAccessPopupVisible(true);
    },
    editRespondent: ({ context }: MenuActionProps<RespondentActionProps>) => {
      const { respondentOrSubjectId } = context || {};
      if (!respondentOrSubjectId) return;

      setRespondentKey(respondentOrSubjectId);
      handleSetDataForAppletPage({ respondentOrSubjectId, key: FilteredAppletsKey.Editable });
      setEditRespondentPopupVisible(true);
    },
    sendInvitation: ({ context }: MenuActionProps<RespondentActionProps>) => {
      const { respondentOrSubjectId, email = null } = context || {};
      if (!respondentOrSubjectId) return;

      handleInviteClick({ respondentOrSubjectId, email });
    },
  };

  const { execute: updateRespondentsPin } = useAsync(
    updateRespondentsPinApi,
    handleReload,
    undefined,
    () => setIsLoading(false),
  );

  const { execute: updateSubjectsPin } = useAsync(
    updateSubjectsPinApi,
    handleReload,
    undefined,
    () => setIsLoading(false),
  );

  const handlePinClick = ({ respondentId, subjectId }: HandlePinClick) => {
    setIsLoading(true);
    if (respondentId) {
      updateRespondentsPin({ ownerId, userId: respondentId });

      return;
    }

    updateSubjectsPin({ ownerId, userId: subjectId });
  };

  const editRespondentOnClose = () => {
    setEditRespondentPopupVisible(false);
    setChosenAppletData(null);
  };

  const removeRespondentAccessOnClose = () => {
    setRemoveAccessPopupVisible(false);
    setChosenAppletData(null);
  };

  const handleInvitationPopupClose = (shouldReFetch?: boolean) => {
    setInvitationPopupVisible(false);
    setRespondentEmail(null);
    shouldReFetch && handleReload();
  };

  const formatRow = (user: Participant): Row => {
    const {
      secretIds,
      nicknames,
      lastSeen,
      id: respondentId,
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
    const respondentOrSubjectId = respondentId ?? details[0].subjectId;
    const accountType = {
      [ParticipantStatus.Invited]: t('full'),
      [ParticipantStatus.NotInvited]: t('limited'),
      [ParticipantStatus.Pending]: t('pendingInvite'),
    }[status];
    const isPending = status === ParticipantStatus.Pending;

    return {
      id: {
        value: respondentOrSubjectId,
        isHidden: true,
      },
      pin: {
        content: () => <Pin isPinned={isPinned} data-testid="dashboard-respondents-pin" />,
        value: '',
        onClick: () => handlePinClick({ respondentId, subjectId: details[0].subjectId }),
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
        content: () => (
          <Chip
            icon={isPending ? <Svg id="email-outlined" width={18} height={18} /> : undefined}
            color={isPending ? 'warning' : 'secondary'}
            title={accountType}
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
              filteredApplets: filteredRespondents?.[respondentOrSubjectId],
              respondentId,
              respondentOrSubjectId,
              appletId,
              email,
              isInviteEnabled: status === ParticipantStatus.NotInvited,
              isViewCalendarEnabled:
                !!respondentId && status === ParticipantStatus.Invited && !isAnonymousRespondent,
            })}
            data-testid="dashboard-respondents-table-actions"
          />
        ),
        value: '',
      },
    };
  };

  const filterRespondentApplets = (user: ParticipantWithDataAccess) => {
    const { details } = user;
    const filteredApplets: FilteredApplets = {
      scheduling: [],
      editable: [],
      viewable: [],
    };
    const { editable, viewable, scheduling } = filteredApplets;

    for (const detail of details) {
      const appletRoles = rolesData?.data?.[detail.appletId];
      if (!appletRoles) continue;
      if (checkIfCanManageParticipants(appletRoles)) {
        editable.push(detail);
        scheduling.push(detail);
      }
      if (detail.teamMemberCanViewData ?? checkIfCanViewParticipants(appletRoles)) {
        viewable.push(detail);
      }
    }

    return filteredApplets;
  };

  const { rows, filteredRespondents }: { filteredRespondents: FilteredRespondents; rows?: Row[] } =
    useMemo(
      () =>
        respondentsData?.result?.reduce(
          (acc: { filteredRespondents: FilteredRespondents; rows: Row[] }, user) => {
            const respondentOrSubjectId = user.id ?? user.details[0].subjectId;
            acc.filteredRespondents[respondentOrSubjectId] = filterRespondentApplets(user);
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

  const getAppletsSmallTable = (key: FilteredAppletsKey) =>
    chosenRespondentsItems?.[key] && ownerId && respondentKey
      ? getAppletsSmallTableRows(
          chosenRespondentsItems[key],
          setChosenAppletData,
          respondentKey,
          ownerId,
        )
      : undefined;

  const viewableAppletsSmallTableRows = getAppletsSmallTable(FilteredAppletsKey.Viewable);
  const editableAppletsSmallTableRows = getAppletsSmallTable(FilteredAppletsKey.Editable);
  const schedulingAppletsSmallTableRows = getAppletsSmallTable(FilteredAppletsKey.Scheduling);
  const dataTestid = 'dashboard-respondents';

  // If there are no roles available we're looking at our own empty workspace
  const showsForbiddenComponent = isForbidden || (roles.length && !canViewParticipants);
  if (showsForbiddenComponent) return noPermissionsComponent;

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
              data-testid={`${dataTestid}-add`}
            >
              {t('addRespondent')}
            </StyledButton>
          </StyledLeftBox>
        )}
        <Search
          withDebounce
          placeholder={t('searchRespondents')}
          onSearch={handleSearch}
          data-testid={`${dataTestid}-search`}
        />
        {appletId && <StyledRightBox />}
      </RespondentsTableHeader>
      <DashboardTable
        columns={getHeadCells(respondentsData?.orderingFields, appletId)}
        rows={rows}
        keyExtractor={({ id }) => `row-${id.value}`}
        emptyComponent={
          !rows?.length && !isLoading ? (
            <EmptyDashboardTable isLoading={isLoading} searchValue={searchValue}>
              {appletId ? (
                <>
                  {t('noRespondentsForApplet')}
                  <Button
                    component={Link}
                    to={generatePath(page.appletAddUser, { appletId })}
                    variant="contained"
                  >
                    {t('addRespondent')}
                  </Button>
                </>
              ) : (
                t('noRespondents')
              )}
            </EmptyDashboardTable>
          ) : undefined
        }
        count={respondentsData?.count || 0}
        hasColFixedWidth
        data-testid={`${dataTestid}-table`}
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
        <ViewParticipantPopup
          popupVisible={viewDataPopupVisible}
          setPopupVisible={setViewDataPopupVisible}
          tableRows={viewableAppletsSmallTableRows}
          chosenAppletData={chosenAppletData}
          setChosenAppletData={setChosenAppletData}
        />
      )}
      {removeAccessPopupVisible && (
        <RemoveRespondentPopup
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
          data-testid={`${dataTestid}-export-data-popup`}
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

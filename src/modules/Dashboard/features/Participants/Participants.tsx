import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate, useParams } from 'react-router-dom';

import { ActionsMenu, MenuActionProps, Pin, Row, Spinner, Svg } from 'shared/components';
import { workspaces } from 'redux/modules';
import { useAsync, useEncryptionStorage, usePermissions, useTable, useTimeAgo } from 'shared/hooks';
import { getWorkspaceRespondentsApi, updateRespondentsPinApi, updateSubjectsPinApi } from 'api';
import { page } from 'resources';
import { getDateInUserTimezone, isManagerOrOwner, joinWihComma, Mixpanel } from 'shared/utils';
import { DEFAULT_ROWS_PER_PAGE, Roles } from 'shared/consts';
import { StyledBody } from 'shared/styles';
import { Respondent, RespondentStatus } from 'modules/Dashboard/types';
import { StyledIcon } from 'shared/components/Search/Search.styles';

import {
  AddParticipantButton,
  FiltersButton,
  ParticipantSearchButton,
  ParticipantsHeader,
  SortByButton,
  HeaderSectionLeft,
  HeaderSectionRight,
} from './Participants.styles';
import { getAppletsSmallTableRows, getHeadCells, getRespondentActions } from './Participants.utils';
import { ParticipantsColumnsWidth } from './Participants.const';
import {
  ChosenAppletData,
  FilteredApplets,
  FilteredAppletsKey,
  FilteredParticipants,
  HandleInviteClick,
  HandlePinClick,
  RespondentActionProps,
  ParticipantsData,
  SetDataForAppletPage,
} from './Participants.types';
// Let's fall back to the respondent pop-ups for now
import {
  DataExportPopup,
  EditRespondentPopup,
  RemoveRespondentPopup,
  ScheduleSetupPopup,
  SendInvitationPopup,
  ViewDataPopup,
} from '../Respondents/Popups';
import { StatusFlag } from '../Respondents/StatusFlag';
import { ParticipantsTable } from './ParticipantsTable';

export const Participants = () => {
  const { appletId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation('app');
  const timeAgo = useTimeAgo();

  const [respondentsData, setRespondentsData] = useState<ParticipantsData | null>(null);
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

  const { searchValue, handleSearch, ordering: _ordering, handleReload, ...tableProps } = useTable((args) => {
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
      Mixpanel.track('Export Data click');
    },
    viewDataAction: ({ context }: MenuActionProps<RespondentActionProps>) => {
      const { respondentOrSubjectId } = context || {};
      if (!respondentOrSubjectId) return;

      if (hasEncryptionCheck && appletId) {
        const chosenAppletData = getChosenAppletData({
          respondentOrSubjectId,
          key: FilteredAppletsKey.Viewable,
        });

        navigate(
          generatePath(page.appletRespondentDataSummary, {
            appletId,
            respondentId: chosenAppletData?.subjectId,
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
      id: respondentId,
      details,
      isPinned,
      isAnonymousRespondent,
      status,
      email,
    } = user;
    const latestActive = lastSeen ? timeAgo.format(getDateInUserTimezone(lastSeen)) : '--';
    const schedule =
      appletId && details?.[0]?.hasIndividualSchedule ? t('individual') : t('default');
    const stringNicknames = joinWihComma(nicknames, true);
    const stringSecretIds = joinWihComma(secretIds, true);
    const respondentOrSubjectId = respondentId ?? details[0].subjectId;

    return {
      pin: {
        content: () => <Pin isPinned={isPinned} data-testid="dashboard-respondents-pin" />,
        value: '',
        onClick: () => handlePinClick({ respondentId, subjectId: details[0].subjectId }),
        width: ParticipantsColumnsWidth.Pin,
      },
      secretIds: {
        content: () => stringSecretIds,
        value: stringSecretIds,
        width: ParticipantsColumnsWidth.Default,
      },
      nicknames: {
        content: () => stringNicknames,
        value: stringNicknames,
        width: ParticipantsColumnsWidth.Default,
      },
      tags: {
        content: () => <>--</>,
        value: '',
        width: ParticipantsColumnsWidth.Default,
      },
      status: {
        content: () => (
          <StatusFlag
            status={status}
            onInviteClick={() => handleInviteClick({ respondentOrSubjectId, email })}
            isInviteDisabled={!filteredRespondents?.[respondentOrSubjectId]?.editable.length}
          />
        ),
        value: '',
        width: ParticipantsColumnsWidth.Status,
      },
      lastSeen: {
        content: () => latestActive,
        value: latestActive,
        width: ParticipantsColumnsWidth.Default,
      },
      ...(appletId && {
        schedule: {
          content: () => schedule,
          value: schedule,
          width: ParticipantsColumnsWidth.Schedule,
        },
      }),
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
              isInviteEnabled: status === RespondentStatus.NotInvited,
              isViewCalendarEnabled:
                !!respondentId && status === RespondentStatus.Invited && !isAnonymousRespondent,
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

  const { rows, filteredRespondents }: { filteredRespondents: FilteredParticipants; rows?: Row[] } =
    useMemo(
      () =>
        respondentsData?.result?.reduce(
          (acc: { filteredRespondents: FilteredParticipants; rows: Row[] }, user) => {
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
      <ParticipantsHeader>
        <HeaderSectionLeft>
          <FiltersButton
            variant="outlined"
            startIcon={
              <StyledIcon>
                <Svg id="slider-rows" height="24" width="24" />
              </StyledIcon>
            }
          >
            {t('filters')}
          </FiltersButton>
          <SortByButton
            variant="outlined"
            endIcon={
              <StyledIcon>
                <Svg id="dropdown-down-outlined" height="24" width="24" />
              </StyledIcon>
            }
          >
            {t('sortBy')}
          </SortByButton>
        </HeaderSectionLeft>
        <HeaderSectionRight>
          <ParticipantSearchButton
            withDebounce
            placeholder={t('searchParticipants')}
            onSearch={handleSearch}
            data-testid={`${dataTestid}-search`}
          />
          {appletId && (
            <AddParticipantButton
              variant="contained"
              onClick={() => navigate(generatePath(page.appletAddUser, { appletId }))}
              data-testid={`${dataTestid}-add`}
            >
              {t('addParticipant')}
            </AddParticipantButton>
          )}
        </HeaderSectionRight>
      </ParticipantsHeader>
      <ParticipantsTable
        columns={getHeadCells(appletId)}
        rows={rows}
        emptyComponent={renderEmptyComponent()}
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
        <ViewDataPopup
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

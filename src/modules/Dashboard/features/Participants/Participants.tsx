import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { Checkbox } from '@mui/material';

import { ActionsMenu, Chip, MenuActionProps, Pin, Row, Spinner, Svg } from 'shared/components';
import { workspaces } from 'redux/modules';
import { useAsync, useEncryptionStorage, usePermissions, useTable, useTimeAgo } from 'shared/hooks';
import { getWorkspaceRespondentsApi, updateRespondentsPinApi, updateSubjectsPinApi } from 'api';
import { page } from 'resources';
import { getDateInUserTimezone, isManagerOrOwner, joinWihComma, Mixpanel } from 'shared/utils';
import { DEFAULT_ROWS_PER_PAGE, Roles } from 'shared/consts';
import { StyledBody } from 'shared/styles';
import { Respondent, RespondentStatus } from 'modules/Dashboard/types';
import { StyledIcon } from 'shared/components/Search/Search.styles';
import { StyledMaybeEmpty } from 'shared/styles/styledComponents/MaybeEmpty';
import { AddParticipantPopup } from 'modules/Dashboard/features/Applet/Popups/AddParticipantPopup';

import {
  AddParticipantButton,
  FiltersButton,
  ParticipantSearchButton,
  ParticipantsHeader,
  SortByButton,
  HeaderSectionLeft,
  HeaderSectionRight,
  ParticipantsTable,
  StyledCheckBox,
} from './Participants.styles';
import {
  getAppletsSmallTableRows,
  getHeadCells,
  getParticipantActions,
} from './Participants.utils';
import { ParticipantsColumnsWidth } from './Participants.const';
import {
  ChosenAppletData,
  FilteredApplets,
  FilteredAppletsKey,
  FilteredParticipants,
  HandleInviteClick,
  HandlePinClick,
  ParticipantsData,
  ParticipantActionProps,
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

  const {
    searchValue,
    handleSearch,
    ordering: _ordering,
    handleReload,
    ...tableProps
  } = useTable((args) => {
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

  const [addParticipantPopupVisible, setAddParticipantPopupVisible] = useState(false);
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
    scheduleSetupAction: ({ context }: MenuActionProps<ParticipantActionProps>) => {
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
    userDataExportAction: ({ context }: MenuActionProps<ParticipantActionProps>) => {
      const { respondentOrSubjectId } = context || {};
      if (!respondentOrSubjectId) return;

      setRespondentKey(respondentOrSubjectId);
      handleSetDataForAppletPage({ respondentOrSubjectId, key: FilteredAppletsKey.Viewable });
      setDataExportPopupVisible(true);
      Mixpanel.track('Export Data click');
    },
    viewDataAction: ({ context }: MenuActionProps<ParticipantActionProps>) => {
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
    removeAccessAction: ({ context }: MenuActionProps<ParticipantActionProps>) => {
      const { respondentOrSubjectId } = context || {};
      if (!respondentOrSubjectId) return;

      setRespondentKey(respondentOrSubjectId);
      handleSetDataForAppletPage({
        respondentOrSubjectId,
        key: FilteredAppletsKey.Editable,
      });
      setRemoveAccessPopupVisible(true);
    },
    editParticipant: ({ context }: MenuActionProps<ParticipantActionProps>) => {
      const { respondentOrSubjectId } = context || {};
      if (!respondentOrSubjectId) return;

      setRespondentKey(respondentOrSubjectId);
      handleSetDataForAppletPage({ respondentOrSubjectId, key: FilteredAppletsKey.Editable });
      setEditRespondentPopupVisible(true);
    },
    sendInvitation: ({ context }: MenuActionProps<ParticipantActionProps>) => {
      const { respondentOrSubjectId, email = null } = context || {};
      if (!respondentOrSubjectId) return;

      handleInviteClick({ respondentOrSubjectId, email });
    },
  };

  const { execute: updateRespondentsPin } = useAsync(updateRespondentsPinApi, handleReload);

  const { execute: updateSubjectsPin } = useAsync(updateSubjectsPinApi, handleReload);

  const handlePinClick = ({ respondentId, subjectId }: HandlePinClick) => {
    setIsLoading(true);
    if (respondentId) {
      updateRespondentsPin({ ownerId, userId: respondentId });

      return;
    }

    updateSubjectsPin({ ownerId, userId: subjectId });
  };

  const addParticipantOnClose = (shouldRefetch: boolean) => {
    setAddParticipantPopupVisible(false);
    setChosenAppletData(null);
    shouldRefetch && handleReload();
  };

  const editRespondentOnClose = (shouldRefetch: boolean) => {
    setEditRespondentPopupVisible(false);
    setChosenAppletData(null);
    shouldRefetch && handleReload();
  };

  const removeRespondentAccessOnClose = (shouldRefetch?: boolean) => {
    setRemoveAccessPopupVisible(false);
    setChosenAppletData(null);
    shouldRefetch && handleReload();
  };

  const handleInvitationPopupClose = (shouldRefetch?: boolean) => {
    setInvitationPopupVisible(false);
    setRespondentEmail(null);
    shouldRefetch && handleReload();
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
    const latestActive = lastSeen ? timeAgo.format(getDateInUserTimezone(lastSeen)) : '';
    const schedule =
      appletId && details?.[0]?.hasIndividualSchedule ? t('individual') : t('default');
    const stringNicknames = joinWihComma(nicknames, true);
    const stringSecretIds = joinWihComma(secretIds, true);
    const respondentOrSubjectId = respondentId ?? details[0].subjectId;
    const accountType = {
      [RespondentStatus.Invited]: t('full'),
      [RespondentStatus.NotInvited]: t('limited'),
      [RespondentStatus.Pending]: t('pendingInvite'),
    }[status];

    const defaultOnClick = () => {
      navigate(
        generatePath(page.appletParticipantActivities, {
          appletId,
          participantId: respondentOrSubjectId,
        }),
      );
    };

    return {
      checkbox: {
        content: () => (
          <Checkbox
            checked={false}
            icon={
              <StyledCheckBox>
                <Svg id="checkbox-empty-outlined" height="20" width="20" />
              </StyledCheckBox>
            }
            data-testid="dashboard-participants-checkbox"
          />
        ),
        value: '',
        width: ParticipantsColumnsWidth.Pin,
      },
      pin: {
        content: () => <Pin isPinned={isPinned} data-testid="dashboard-participants-pin" />,
        value: '',
        onClick: () => handlePinClick({ respondentId, subjectId: details[0].subjectId }),
        width: ParticipantsColumnsWidth.Pin,
      },
      secretIds: {
        content: () => stringSecretIds,
        value: stringSecretIds,
        width: ParticipantsColumnsWidth.Default,
        onClick: defaultOnClick,
      },
      nicknames: {
        content: () => stringNicknames,
        value: stringNicknames,
        width: ParticipantsColumnsWidth.Default,
        onClick: defaultOnClick,
      },
      tags: {
        // TODO: Replace `null` with tag when available
        // https://mindlogger.atlassian.net/browse/M2-5861
        content: () => <StyledMaybeEmpty>{null}</StyledMaybeEmpty>,
        value: '',
        width: ParticipantsColumnsWidth.Default,
        onClick: defaultOnClick,
      },
      accountType: {
        // TODO: Replace with new Chip/Tag variant when available
        // https://mindlogger.atlassian.net/browse/M2-6161
        content: () => (
          <Chip title={accountType} color="secondary" sxProps={{ pointerEvents: 'none', m: 0 }} />
        ),
        value: accountType,
        width: ParticipantsColumnsWidth.AccountType,
        onClick: defaultOnClick,
      },
      lastSeen: {
        content: () => <StyledMaybeEmpty>{latestActive}</StyledMaybeEmpty>,
        value: latestActive,
        width: ParticipantsColumnsWidth.Default,
        onClick: defaultOnClick,
      },
      ...(appletId && {
        schedule: {
          content: () => schedule,
          value: schedule,
          width: ParticipantsColumnsWidth.Schedule,
          onClick: defaultOnClick,
        },
      }),
      actions: {
        content: () => (
          <ActionsMenu
            menuItems={getParticipantActions({
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
            data-testid="dashboard-participants-table-actions"
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
  const dataTestid = 'dashboard-participants';

  const renderEmptyComponent = () => {
    if (!rows?.length && !isLoading) {
      if (searchValue) {
        return t('noMatchWasFound', { searchValue });
      }

      return appletId ? t('noParticipantsForApplet') : t('noParticipants');
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
              onClick={() => setAddParticipantPopupVisible(true)}
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
      {appletId && addParticipantPopupVisible && (
        <AddParticipantPopup
          popupVisible={addParticipantPopupVisible}
          appletId={appletId}
          onClose={addParticipantOnClose}
        />
      )}
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

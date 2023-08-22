import { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { Box } from '@mui/material';

import { Actions, Pin, Svg, Search, DEFAULT_ROWS_PER_PAGE, Row, Spinner } from 'shared/components';
import { Respondent, users, workspaces } from 'redux/modules';
import {
  useTimeAgo,
  useBreadcrumbs,
  useTable,
  useAsync,
  usePermissions,
  useEncryptionStorage,
} from 'shared/hooks';
import { Table } from 'modules/Dashboard/components';
import { updateRespondentsPinApi } from 'api';
import { useAppDispatch } from 'redux/store';
import { page } from 'resources';
import { getDateInUserTimezone, isManagerOrOwner, joinWihComma, Mixpanel } from 'shared/utils';
import { Roles } from 'shared/consts';

import {
  RespondentsTableHeader,
  StyledButton,
  StyledLeftBox,
  StyledRightBox,
} from './Respondents.styles';
import { getActions, getAppletsSmallTableRows } from './Respondents.utils';
import { getHeadCells } from './Respondents.const';
import { ChosenAppletData, FilteredApplets, FilteredRespondents } from './Respondents.types';
import {
  DataExportPopup,
  ScheduleSetupPopup,
  ViewDataPopup,
  RespondentsRemoveAccessPopup,
  EditRespondentPopup,
} from './Popups';

export const Respondents = () => {
  const dispatch = useAppDispatch();
  const { appletId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation('app');
  const timeAgo = useTimeAgo();
  useBreadcrumbs();

  const rolesData = workspaces.useRolesData();
  const respondentsData = users.useRespondentsData();
  const loadingStatus = users.useRespondentsStatus();
  const { ownerId } = workspaces.useData() || {};
  const { getWorkspaceRespondents } = users.thunk;

  const { isForbidden, noPermissionsComponent } = usePermissions(() =>
    dispatch(
      getWorkspaceRespondents({
        params: {
          ownerId,
          limit: DEFAULT_ROWS_PER_PAGE,
          ...(appletId && { appletId }),
        },
      }),
    ),
  );

  const { searchValue, handleSearch, ordering, handleReload, ...tableProps } = useTable((args) => {
    const params = {
      ...args,
      params: {
        ...args.params,
        ...(appletId && { appletId }),
      },
    };

    return dispatch(getWorkspaceRespondents(params));
  });

  const [scheduleSetupPopupVisible, setScheduleSetupPopupVisible] = useState(false);
  const [dataExportPopupVisible, setDataExportPopupVisible] = useState(false);
  const [viewDataPopupVisible, setViewDataPopupVisible] = useState(false);
  const [removeAccessPopupVisible, setRemoveAccessPopupVisible] = useState(false);
  const [editRespondentPopupVisible, setEditRespondentPopupVisible] = useState(false);
  const [respondentKey, setRespondentKey] = useState<null | string>(null);
  const [chosenAppletData, setChosenAppletData] = useState<null | ChosenAppletData>(null);

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

  const actions = {
    scheduleSetupAction: (respondentId: string) => {
      setRespondentKey(respondentId);
      handleSetDataForAppletPage(respondentId, 'scheduling');
      setScheduleSetupPopupVisible(true);
    },
    userDataExportAction: (respondentId: string) => {
      setRespondentKey(respondentId);
      handleSetDataForAppletPage(respondentId, 'viewable');
      setDataExportPopupVisible(true);
      Mixpanel.track('Export Data click');
    },
    viewDataAction: (respondentId: string) => {
      if (hasEncryptionCheck && appletId) {
        respondentId &&
          navigate(generatePath(page.appletRespondentDataSummary, { appletId, respondentId }));

        return;
      }
      handleSetDataForAppletPage(respondentId, 'viewable');
      setRespondentKey(respondentId);
      setViewDataPopupVisible(true);
    },
    removeAccessAction: (respondentId: string) => {
      setRespondentKey(respondentId);
      handleSetDataForAppletPage(respondentId, 'editable');
      setRemoveAccessPopupVisible(true);
    },
    editRespondent: (respondentId: string) => {
      setRespondentKey(respondentId);
      handleSetDataForAppletPage(respondentId, 'editable');
      setEditRespondentPopupVisible(true);
    },
  };

  const { execute } = useAsync(updateRespondentsPinApi, handleReload);

  const handlePinClick = (userId: string) => {
    execute({ ownerId, userId });
  };

  const formatRow = (user: Respondent): Row => {
    const { secretIds, nicknames, lastSeen, id, details, isPinned, isAnonymousRespondent } = user;
    const latestActive = lastSeen ? timeAgo.format(getDateInUserTimezone(lastSeen)) : '';
    const schedule =
      appletId && details?.[0]?.hasIndividualSchedule
        ? t('individualSchedule')
        : t('defaultSchedule');
    const stringNicknames = joinWihComma(nicknames);
    const stringSecretIds = joinWihComma(secretIds);

    return {
      pin: {
        content: () => <Pin isPinned={isPinned} data-testid="dashboard-respondents-pin" />,
        value: '',
        onClick: () => handlePinClick(id),
      },
      secretId: {
        content: () => stringSecretIds,
        value: stringSecretIds,
        width: '30%',
      },
      nickname: {
        content: () => stringNicknames,
        value: stringNicknames,
      },
      latestActive: {
        content: () => latestActive,
        value: latestActive,
      },
      ...(appletId && {
        schedule: {
          content: () => schedule,
          value: schedule,
        },
      }),
      actions: {
        content: (_, hasVisibleActions) => (
          <Actions
            items={getActions(actions, filteredRespondents?.[id], isAnonymousRespondent, appletId)}
            context={id}
            visibleByDefault={hasVisibleActions}
          />
        ),
        value: '',
        width: '330',
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
      [respondentsData],
    );

  useEffect(
    () => () => {
      dispatch(users.actions.resetRespondentsData());
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
    if (rows && !rows.length) {
      return appletId ? t('noRespondentsForApplet') : t('noRespondents');
    }

    return searchValue && t('noMatchWasFound', { searchValue });
  };

  if (isForbidden) return noPermissionsComponent;

  return loadingStatus === 'loading' ? (
    <Box sx={{ height: '100%', position: 'relative' }}>
      <Spinner />
    </Box>
  ) : (
    <>
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
          placeholder={t('searchRespondents')}
          onSearch={handleSearch}
          data-testid="dashboard-respondents-search"
        />
        {appletId && <StyledRightBox />}
      </RespondentsTableHeader>
      <Table
        columns={getHeadCells(appletId)}
        rows={rows}
        emptyComponent={renderEmptyComponent()}
        count={respondentsData?.count || 0}
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
          setPopupVisible={setRemoveAccessPopupVisible}
          tableRows={editableAppletsSmallTableRows}
          chosenAppletData={chosenAppletData}
          setChosenAppletData={setChosenAppletData}
          reFetchRespondents={handleReload}
        />
      )}
      {dataExportPopupVisible && (
        <DataExportPopup
          popupVisible={dataExportPopupVisible}
          setPopupVisible={setDataExportPopupVisible}
          tableRows={viewableAppletsSmallTableRows}
          chosenAppletData={chosenAppletData}
          setChosenAppletData={setChosenAppletData}
        />
      )}
      {editRespondentPopupVisible && (
        <EditRespondentPopup
          popupVisible={editRespondentPopupVisible}
          setPopupVisible={setEditRespondentPopupVisible}
          chosenAppletData={chosenAppletData}
          setChosenAppletData={setChosenAppletData}
          reFetchRespondents={handleReload}
        />
      )}
    </>
  );
};

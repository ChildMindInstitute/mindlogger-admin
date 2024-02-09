import { useMemo, useState, useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate, useParams } from 'react-router-dom';

import { getWorkspaceRespondentsApi, updateRespondentsPinApi } from 'api';
import { DashboardTable } from 'modules/Dashboard/components';
import { Respondent } from 'modules/Dashboard/types';
import { workspaces } from 'redux/modules';
import { page } from 'resources';
import { Actions, Pin, Svg, Search, Row, Spinner } from 'shared/components';
import { Roles, DEFAULT_ROWS_PER_PAGE } from 'shared/consts';
import { useTimeAgo, useTable, useAsync, usePermissions, useEncryptionStorage } from 'shared/hooks';
import { StyledBody } from 'shared/styles';
import { getDateInUserTimezone, isManagerOrOwner, joinWihComma, Mixpanel } from 'shared/utils';

import {
  DataExportPopup,
  ScheduleSetupPopup,
  ViewDataPopup,
  RespondentsRemoveAccessPopup,
  EditRespondentPopup,
} from './Popups';
import { getHeadCells, RespondentsColumnsWidth } from './Respondents.const';
import { RespondentsTableHeader, StyledButton, StyledLeftBox, StyledRightBox } from './Respondents.styles';
import { ChosenAppletData, FilteredApplets, FilteredRespondents, RespondentsData } from './Respondents.types';
import { getActions, getAppletsSmallTableRows } from './Respondents.utils';

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
        respondentId && navigate(generatePath(page.appletRespondentDataSummary, { appletId, respondentId }));

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

  const { execute: updateRespondentsPin } = useAsync(updateRespondentsPinApi, handleReload, undefined, () =>
    setIsLoading(false),
  );

  const handlePinClick = (userId: string) => {
    setIsLoading(true);
    updateRespondentsPin({ ownerId, userId });
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

  const formatRow = (user: Respondent): Row => {
    const { secretIds, nicknames, lastSeen, id, details, isPinned, isAnonymousRespondent } = user;
    const latestActive = lastSeen ? timeAgo.format(getDateInUserTimezone(lastSeen)) : '';
    const schedule = appletId && details?.[0]?.hasIndividualSchedule ? t('individualSchedule') : t('defaultSchedule');
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
          width: RespondentsColumnsWidth.Default,
        },
      }),
      actions: {
        content: (_, hasVisibleActions) => (
          <Actions
            items={getActions(actions, filteredRespondents?.[id], isAnonymousRespondent, appletId)}
            context={id}
            visibleByDefault={hasVisibleActions}
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

  const { rows, filteredRespondents }: { filteredRespondents: FilteredRespondents; rows?: Row[] } = useMemo(
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
      ? getAppletsSmallTableRows(chosenRespondentsItems[key], setChosenAppletData, respondentKey, ownerId)
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
    </StyledBody>
  );
};

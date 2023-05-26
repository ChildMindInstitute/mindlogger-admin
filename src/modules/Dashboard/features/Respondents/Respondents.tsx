import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate, useParams } from 'react-router-dom';

import { Actions, Pin, Svg, Search, DEFAULT_ROWS_PER_PAGE } from 'shared/components';
import { users, workspaces } from 'redux/modules';
import {
  useTimeAgo,
  useBreadcrumbs,
  useTable,
  useAsync,
  useEncryptionCheckFromStorage,
  usePermissions,
} from 'shared/hooks';
import { Table } from 'modules/Dashboard/components';
import { updateRespondentsPinApi } from 'api';
import { useAppDispatch } from 'redux/store';
import { page } from 'resources';
import { getDateInUserTimezone, joinWihComma } from 'shared/utils';
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
  const [filteredRespondents, setfilteredRespondents] = useState<FilteredRespondents>({});

  const { getAppletPrivateKey } = useEncryptionCheckFromStorage();
  const hasEncryptionCheck = !!getAppletPrivateKey(appletId ?? '');

  const actions = {
    scheduleSetupAction: (respondentId: string) => {
      setRespondentKey(respondentId);
      setScheduleSetupPopupVisible(true);
    },
    userDataExportAction: (respondentId: string) => {
      setRespondentKey(respondentId);
      setDataExportPopupVisible(true);
    },
    viewDataAction: (respondentId: string) => {
      if (hasEncryptionCheck && appletId) {
        respondentId &&
          navigate(generatePath(page.appletRespondentDataSummary, { appletId, respondentId }));

        return;
      }

      setRespondentKey(respondentId);
      setViewDataPopupVisible(true);
    },
    removeAccessAction: (respondentId: string) => {
      setRespondentKey(respondentId);
      setRemoveAccessPopupVisible(true);
    },
    editRespondent: (respondentId: string) => {
      setRespondentKey(respondentId);

      if (respondentId && appletId && ownerId) {
        const respondentAccess = filteredRespondents[respondentId]?.editaable?.find(
          (item) => item.appletId === appletId,
        );
        const chosenAppletData = respondentAccess && {
          ...respondentAccess,
          respondentId,
          ownerId,
        };
        setChosenAppletData(chosenAppletData ?? null);
      }
      setEditRespondentPopupVisible(true);
    },
  };

  const { execute } = useAsync(updateRespondentsPinApi, handleReload);

  const handlePinClick = (userId: string) => {
    execute({ ownerId, userId });
  };

  const rows = respondentsData?.result?.map((user) => {
    const { secretIds, nicknames, lastSeen, id, details, isPinned } = user;
    const latestActive = lastSeen ? timeAgo.format(getDateInUserTimezone(lastSeen)) : '';
    const schedule =
      appletId && details?.[0]?.hasIndividualSchedule
        ? t('individualSchedule')
        : t('defaultSchedule');
    const stringNicknames = joinWihComma(nicknames);
    const stringSecretIds = joinWihComma(secretIds);

    return {
      pin: {
        content: () => <Pin isPinned={isPinned} />,
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
        content: () => (
          <Actions items={getActions(actions, filteredRespondents[id], appletId)} context={id} />
        ),
        value: '',
        width: '330',
      },
    };
  });

  const chosenRespondentsItems = respondentKey
    ? filteredRespondents[respondentKey as keyof typeof filteredRespondents]
    : undefined;

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
  const editableAppletsSmallTableRows = getAppletsSmallTable('editaable');
  const schedulingAppletsSmallTableRows = getAppletsSmallTable('scheduling');

  const renderEmptyComponent = () => {
    if (!rows?.length) {
      return appletId ? t('noRespondentsForApplet') : t('noRespondents');
    }

    return searchValue && t('noMatchWasFound', { searchValue });
  };

  useEffect(() => {
    const respondentsByRoles = respondentsData?.result?.reduce(
      (acc: FilteredRespondents, { details, id }) => {
        const filteredRespondents = {
          scheduling: [],
          editaable: [],
          viewable: [],
        } as FilteredApplets;
        const { editaable, viewable, scheduling } = filteredRespondents;

        for (const detail of details) {
          const workspaceRoles = rolesData?.data?.[detail.appletId];
          if (workspaceRoles?.[0] === Roles.Manager || workspaceRoles?.[0] === Roles.Owner) {
            editaable.push(detail);
            viewable.push(detail);
            scheduling.push(detail);
            continue;
          }
          if (workspaceRoles?.includes(Roles.Reviewer)) {
            viewable.push(detail);
          }
          if (workspaceRoles?.includes(Roles.Coordinator)) {
            scheduling.push(detail);
          }
        }

        acc[id] = filteredRespondents;

        return acc;
      },
      {},
    );
    respondentsByRoles && setfilteredRespondents(respondentsByRoles);
  }, [respondentsData]);

  if (isForbidden) return noPermissionsComponent;

  return (
    <>
      <RespondentsTableHeader hasButton={!!appletId}>
        {appletId && (
          <StyledLeftBox>
            <StyledButton
              variant="outlined"
              startIcon={<Svg width={18} height={18} id="respondent-outlined" />}
              onClick={() => navigate(generatePath(page.appletAddUser, { appletId }))}
            >
              {t('addRespondent')}
            </StyledButton>
          </StyledLeftBox>
        )}
        <Search placeholder={t('searchRespondents')} onSearch={handleSearch} />
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
          refetchRespondents={handleReload}
        />
      )}
    </>
  );
};

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate, useParams } from 'react-router-dom';

import { Actions, Pin, Svg, Search, DEFAULT_ROWS_PER_PAGE, Spinner } from 'shared/components';
import { users, workspaces } from 'redux/modules';
import { useTimeAgo, useBreadcrumbs, useTable, useAsync } from 'shared/hooks';
import { Table } from 'modules/Dashboard/components';
import { getWorkspaceRespondentAccessesApi, updatePinApi } from 'api';
import { useAppDispatch } from 'redux/store';
import { page } from 'resources';
import { getDateInUserTimezone } from 'shared/utils';

import {
  RespondentsTableHeader,
  StyledButton,
  StyledLeftBox,
  StyledRightBox,
} from './Respondents.styles';
import { getActions, getAppletsSmallTableRows, getChosenAppletData } from './Respondents.utils';
import { getHeadCells } from './Respondents.const';
import { ChosenAppletData } from './Respondents.types';
import {
  DataExportPopup,
  ScheduleSetupPopup,
  ViewDataPopup,
  RespondentsRemoveAccessPopup,
  EditRespondentPopup,
} from './Popups';

export const Respondents = () => {
  const dispatch = useAppDispatch();
  const { appletId: id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation('app');
  const timeAgo = useTimeAgo();

  useBreadcrumbs([
    {
      icon: 'respondent-outlined',
      label: t('respondents'),
    },
  ]);

  const respondentsData = users.useRespondentsData();

  const { ownerId } = workspaces.useData() || {};

  const { getWorkspaceRespondents } = users.thunk;

  const { searchValue, handleSearch, ordering, ...tableProps } = useTable((args) => {
    const params = {
      ...args,
      params: {
        ...args.params,
        ...(id && { appletId: id }),
      },
    };

    return dispatch(getWorkspaceRespondents(params));
  });

  const [scheduleSetupPopupVisible, setScheduleSetupPopupVisible] = useState(false);
  const [dataExportPopupVisible, setDataExportPopupVisible] = useState(false);
  const [viewDataPopupVisible, setViewDataPopupVisible] = useState(false);
  const [removeAccessPopupVisible, setRemoveAccessPopupVisible] = useState(false);
  const [editRespondentPopupVisible, setEditRespondentPopupVisible] = useState(false);
  const [respondentsDataIndex, setRespondentsDataIndex] = useState<null | number>(null);
  const [chosenAppletData, setChosenAppletData] = useState<null | ChosenAppletData>(null);
  const [respondentAccesses, setRespondentAccesses] = useState<null | ChosenAppletData[]>(null);

  useBreadcrumbs();

  const actions = {
    scheduleSetupAction: (index: number) => {
      setRespondentsDataIndex(index);
      setScheduleSetupPopupVisible(true);
    },
    userDataExportAction: (index: number) => {
      setRespondentsDataIndex(index);
      setDataExportPopupVisible(true);
    },
    viewDataAction: (index: number) => {
      setRespondentsDataIndex(index);
      setViewDataPopupVisible(true);
    },
    removeAccessAction: (index: number) => {
      setRespondentsDataIndex(index);
      setRemoveAccessPopupVisible(true);
    },
    editRespondent: (index: number) => {
      setRespondentsDataIndex(index);
      setEditRespondentPopupVisible(true);
    },
  };

  const { execute } = useAsync(updatePinApi, () => {
    ownerId &&
      dispatch(
        getWorkspaceRespondents({
          params: {
            ownerId,
            limit: DEFAULT_ROWS_PER_PAGE,
            search: searchValue,
            page: tableProps.page,
            ...(id && { appletId: id }),
            ...(ordering && { ordering }),
          },
        }),
      );
  });

  const { execute: getWorkspaceRespondentAccesses, isLoading } = useAsync(
    getWorkspaceRespondentAccessesApi,
    (res) => {
      const appletsData = res?.data?.result as ChosenAppletData[] | undefined;
      setRespondentAccesses(appletsData ?? null);
    },
    () => setRespondentAccesses(null),
  );

  const handlePinClick = (accessId: string) => {
    execute({ ownerId, accessId });
  };

  const rows = respondentsData?.result?.map((user, index) => {
    const { secretId, nickname, lastSeen, accessId, isPinned, schedule } = user;
    const latestActive = lastSeen ? timeAgo.format(getDateInUserTimezone(lastSeen)) : '';

    return {
      pin: {
        content: () => <Pin isPinned={isPinned} />,
        value: '',
        onClick: () => handlePinClick(accessId),
      },
      secretId: {
        content: () => secretId,
        value: secretId,
      },
      nickname: {
        content: () => nickname,
        value: nickname,
      },
      latestActive: {
        content: () => latestActive,
        value: latestActive,
      },
      ...(id && {
        schedule: {
          content: () => schedule,
          value: schedule,
        },
      }),
      actions: {
        content: () => <Actions items={getActions(actions)} context={index} />,
        value: '',
        width: '330',
      },
    };
  });

  const chosenRespondentsItems =
    respondentsDataIndex || respondentsDataIndex === 0
      ? respondentsData?.result[respondentsDataIndex]
      : undefined;

  const appletsSmallTableRows = getAppletsSmallTableRows(
    respondentAccesses,
    setChosenAppletData,
    chosenRespondentsItems?.id,
  );

  const renderEmptyComponent = () => {
    if (!rows?.length) {
      return id ? t('noRespondentsForApplet') : t('noRespondents');
    }

    return searchValue && t('noMatchWasFound', { searchValue });
  };

  useEffect(() => {
    const respondentId = chosenRespondentsItems?.id;
    if (ownerId && respondentId) {
      getWorkspaceRespondentAccesses({ ownerId, respondentId });

      return;
    }

    setRespondentAccesses(null);
  }, [ownerId, chosenRespondentsItems]);

  useEffect(() => {
    if (!respondentAccesses) return;

    const respondentId = chosenRespondentsItems?.id;
    if (respondentId && id) {
      const respondentAccess = respondentAccesses.find(({ appletId }) => id === appletId);
      const chosenAppletData =
        respondentAccess && getChosenAppletData(respondentAccess, respondentId);
      setChosenAppletData(chosenAppletData ?? null);

      return;
    }

    setChosenAppletData(null);
  }, [
    respondentAccesses,
    chosenRespondentsItems,
    chosenRespondentsItems,
    scheduleSetupPopupVisible,
    dataExportPopupVisible,
    viewDataPopupVisible,
    removeAccessPopupVisible,
    editRespondentPopupVisible,
  ]);

  return (
    <>
      <RespondentsTableHeader hasButton={!!id}>
        {id && (
          <StyledLeftBox>
            <StyledButton
              variant="outlined"
              startIcon={<Svg width={18} height={18} id="respondent-outlined" />}
              onClick={() => navigate(generatePath(page.appletAddUser, { appletId: id }))}
            >
              {t('addRespondent')}
            </StyledButton>
          </StyledLeftBox>
        )}
        <Search placeholder={t('searchRespondents')} onSearch={handleSearch} />
        {id && <StyledRightBox />}
      </RespondentsTableHeader>
      <Table
        columns={getHeadCells(id)}
        rows={rows}
        emptyComponent={renderEmptyComponent()}
        count={respondentsData?.count || 0}
        {...tableProps}
      />
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {scheduleSetupPopupVisible && (
            <ScheduleSetupPopup
              popupVisible={scheduleSetupPopupVisible}
              setPopupVisible={setScheduleSetupPopupVisible}
              tableRows={appletsSmallTableRows}
              chosenAppletData={chosenAppletData}
              setChosenAppletData={setChosenAppletData}
            />
          )}
          {viewDataPopupVisible && (
            <ViewDataPopup
              popupVisible={viewDataPopupVisible}
              setPopupVisible={setViewDataPopupVisible}
              tableRows={appletsSmallTableRows}
              chosenAppletData={chosenAppletData}
              setChosenAppletData={setChosenAppletData}
            />
          )}
          {removeAccessPopupVisible && (
            <RespondentsRemoveAccessPopup
              popupVisible={removeAccessPopupVisible}
              setPopupVisible={setRemoveAccessPopupVisible}
              tableRows={appletsSmallTableRows}
              chosenAppletData={chosenAppletData}
              setChosenAppletData={setChosenAppletData}
            />
          )}
          {dataExportPopupVisible && (
            <DataExportPopup
              popupVisible={dataExportPopupVisible}
              setPopupVisible={setDataExportPopupVisible}
              tableRows={appletsSmallTableRows}
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
            />
          )}
        </>
      )}
    </>
  );
};

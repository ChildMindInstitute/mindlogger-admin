import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate, useParams } from 'react-router-dom';

import { Actions, Pin, Svg, Search } from 'shared/components';
import { users, workspaces } from 'redux/modules';
import {
  useTimeAgo,
  useBreadcrumbs,
  useTable,
  useAsync,
  useEncryptionCheckFromStorage,
} from 'shared/hooks';
import { Table } from 'modules/Dashboard/components';
import { updateRespondentsPinApi } from 'api';
import { useAppDispatch } from 'redux/store';
import { page } from 'resources';
import { getDateInUserTimezone, joinWihComma } from 'shared/utils';

import {
  RespondentsTableHeader,
  StyledButton,
  StyledLeftBox,
  StyledRightBox,
} from './Respondents.styles';
import { getActions, getAppletsSmallTableRows } from './Respondents.utils';
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
  const { appletId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation('app');
  const timeAgo = useTimeAgo();
  useBreadcrumbs();

  const respondentsData = users.useRespondentsData();
  const { ownerId } = workspaces.useData() || {};
  const { getWorkspaceRespondents } = users.thunk;

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
  const [respondentsDataIndex, setRespondentsDataIndex] = useState<null | number>(null);
  const [chosenAppletData, setChosenAppletData] = useState<null | ChosenAppletData>(null);

  const { getAppletPrivateKey } = useEncryptionCheckFromStorage();
  const hasEncryptionCheck = !!getAppletPrivateKey(appletId ?? '');
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
      if (hasEncryptionCheck && appletId) {
        const respondentId = respondentsData?.result[index]?.id;
        respondentId &&
          navigate(generatePath(page.appletRespondentDataSummary, { appletId, respondentId }));

        return;
      }

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

  const { execute } = useAsync(updateRespondentsPinApi, handleReload);

  const handlePinClick = (userId: string) => {
    execute({ ownerId, userId });
  };

  const rows = respondentsData?.result?.map((user, index) => {
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
        content: () => <Actions items={getActions(actions, appletId)} context={index} />,
        value: '',
        width: '330',
      },
    };
  });

  const chosenRespondentsItems =
    respondentsDataIndex || respondentsDataIndex === 0
      ? respondentsData?.result[respondentsDataIndex]
      : undefined;

  const appletsSmallTableRows =
    chosenRespondentsItems?.details && ownerId
      ? getAppletsSmallTableRows(
          chosenRespondentsItems.details,
          setChosenAppletData,
          chosenRespondentsItems?.id,
          ownerId,
        )
      : undefined;

  const renderEmptyComponent = () => {
    if (!rows?.length) {
      return appletId ? t('noRespondentsForApplet') : t('noRespondents');
    }

    return searchValue && t('noMatchWasFound', { searchValue });
  };

  useEffect(() => {
    if (!chosenRespondentsItems) return;

    const respondentId = chosenRespondentsItems?.id ?? '';

    if (respondentId && appletId && ownerId) {
      const respondentAccess = chosenRespondentsItems?.details.find(
        (item) => item.appletId === appletId,
      );
      const chosenAppletData = respondentAccess && {
        ...respondentAccess,
        respondentId,
        ownerId,
      };
      setChosenAppletData(chosenAppletData ?? null);

      return;
    }

    setChosenAppletData(null);
  }, [
    chosenRespondentsItems,
    scheduleSetupPopupVisible,
    dataExportPopupVisible,
    viewDataPopupVisible,
    removeAccessPopupVisible,
    editRespondentPopupVisible,
  ]);

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
          refetchRespondents={handleReload}
        />
      )}
    </>
  );
};

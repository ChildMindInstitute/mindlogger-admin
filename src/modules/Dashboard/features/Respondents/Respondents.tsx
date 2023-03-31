import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { Actions, Pin, Svg, Search } from 'shared/components';
import { users, folders } from 'redux/modules';
import { useTimeAgo, useBreadcrumbs, useTable } from 'shared/hooks';
import { Table } from 'modules/Dashboard/components';

import {
  RespondentsTableHeader,
  StyledButton,
  StyledLeftBox,
  StyledRightBox,
} from './Respondents.styles';
import { getActions, getAppletsSmallTableRows, getChosenAppletData } from './Respondents.utils';
import { headCells } from './Respondents.const';
import { ChosenAppletData } from './Respondents.types';
import {
  DataExportPopup,
  ScheduleSetupPopup,
  ViewDataPopup,
  RespondentsRemoveAccessPopup,
  EditRespondentPopup,
} from './Popups';

export const Respondents = () => {
  const { id } = useParams();
  const { t } = useTranslation('app');
  const timeAgo = useTimeAgo();

  const respondentsData = users.useRespondentsData();
  const appletsData = folders.useFlattenFoldersApplets();
  const { getWorkspaceUsers } = users.thunk;

  const { searchValue, setSearchValue, ...tableProps } = useTable(getWorkspaceUsers);

  const [scheduleSetupPopupVisible, setScheduleSetupPopupVisible] = useState(false);
  const [dataExportPopupVisible, setDataExportPopupVisible] = useState(false);
  const [viewDataPopupVisible, setViewDataPopupVisible] = useState(false);
  const [removeAccessPopupVisible, setRemoveAccessPopupVisible] = useState(false);
  const [editRespondentPopupVisible, setEditRespondentPopupVisible] = useState(false);
  const [respondentsDataIndex, setRespondentsDataIndex] = useState<null | number>(null);
  const [chosenAppletData, setChosenAppletData] = useState<null | ChosenAppletData>(null);

  useBreadcrumbs([
    {
      icon: <Svg id="respondent-outlined" width="13.5" height="15" />,
      label: t('respondents'),
    },
  ]);

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
  // TODO: add updatePin
  const handlePinClick = async (profileId: string, newState: boolean) => {
    //const { updatePin, getUsersList } = users.thunk;
    // const result = await dispatch(updatePin({ profileId, newState }));
    // if (updatePin.fulfilled.match(result)) {
    //   dispatch(getUsersList());
    // }
  };

  const rows = respondentsData?.result?.map((user, index) => {
    const { secretId, nickname, lastSeen, id } = user;
    const latestAactive = lastSeen ? timeAgo.format(new Date(lastSeen)) : '';

    return {
      pin: {
        content: () => <Pin isPinned={false} />,
        value: '',
        onClick: () => handlePinClick(id, true),
      },
      secretId: {
        content: () => secretId,
        value: secretId,
      },
      nickname: {
        content: () => nickname,
        value: nickname,
      },
      latestAactive: {
        content: () => latestAactive,
        value: latestAactive,
      },
      actions: {
        content: () => <Actions items={getActions(actions)} context={index} />,
        value: '',
        width: '330',
      },
    };
  });

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const chosenRespondentsItems =
    respondentsDataIndex || respondentsDataIndex === 0
      ? respondentsData?.result[respondentsDataIndex]
      : undefined;

  const appletsSmallTableRows = getAppletsSmallTableRows(
    chosenRespondentsItems,
    appletsData,
    setChosenAppletData,
  );

  const renderEmptyComponent = () => {
    if (!rows?.length) {
      return id ? t('noRespondentsForApplet') : t('noRespondents');
    }

    return searchValue && t('noMatchWasFound', { searchValue });
  };

  useEffect(() => {
    const keys = chosenRespondentsItems && Object.keys(chosenRespondentsItems);
    if (keys && keys.length === 1) {
      const appletId = keys[0];
      const { appletName, secretUserId, hasIndividualSchedule, userId, nickName } =
        getChosenAppletData(chosenRespondentsItems, appletsData, appletId);
      const chosenAppletData = {
        appletId,
        appletName,
        secretUserId,
        hasIndividualSchedule,
        userId,
        nickName,
      };
      setChosenAppletData(chosenAppletData);
    } else {
      setChosenAppletData(null);
    }
  }, [
    appletsData,
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
            >
              {t('addRespondent')}
            </StyledButton>
          </StyledLeftBox>
        )}
        <Search placeholder={t('searchRespondents')} onSearch={handleSearch} />
        {id && <StyledRightBox />}
      </RespondentsTableHeader>
      <Table
        columns={headCells}
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
        />
      )}
    </>
  );
};

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { Actions, Pin, Svg, Search, Table, Row } from 'components';
import { users, UserData, folders } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { useTimeAgo, useBreadcrumbs } from 'hooks';
import { filterRows } from 'utils/filterRows';
import { prepareRespondentsData } from 'utils/prepareUsersData';

import { ScheduleSetupPopup, ViewDataPopup, DataExportPopup, RemoveAccessPopup } from './Popups';
import {
  RespondentsTableHeader,
  StyledButton,
  StyledLeftBox,
  StyledRightBox,
} from './Respondents.styles';
import { getActions, getAppletsSmallTableRows, getChosenAppletData } from './Respondents.utils';
import { headCells } from './Respondents.const';
import { ChosenAppletData } from './Respondents.types';

export const Respondents = () => {
  const { id } = useParams();
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const usersData = users.useUserData();
  const appletsData = folders.useFlattenFoldersApplets();
  const timeAgo = useTimeAgo();
  const [searchValue, setSearchValue] = useState('');
  const [scheduleSetupPopupVisible, setScheduleSetupPopupVisible] = useState(false);
  const [dataExportPopupVisible, setDataExportPopupVisible] = useState(false);
  const [viewDataPopupVisible, setViewDataPopupVisible] = useState(false);
  const [removeAccessPopupVisible, setRemoveAccessPopupVisible] = useState(false);
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
  };

  const handlePinClick = async (profileId: string, newState: boolean) => {
    const { updatePin, getUsersList } = users.thunk;
    const result = await dispatch(updatePin({ profileId, newState }));

    if (updatePin.fulfilled.match(result)) {
      dispatch(getUsersList());
    }
  };

  const usersArr = (
    id ? prepareRespondentsData(usersData?.items, id) : prepareRespondentsData(usersData?.items)
  ) as UserData[];

  const rows = usersArr?.map((user, index) => {
    const { pinned, MRN, nickName, updated, _id: profileId } = user;
    const lastEdited = updated ? timeAgo.format(new Date(updated)) : '';

    return {
      pin: {
        content: () => <Pin isPinned={pinned} />,
        value: '',
        onClick: () => handlePinClick(profileId, !pinned),
      },
      secretId: {
        content: () => MRN,
        value: MRN,
      },
      nickname: {
        content: () => nickName,
        value: nickName,
      },
      updated: {
        content: () => lastEdited,
        value: lastEdited,
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

  const handleFilterRows = (rows: Row[]) =>
    rows?.filter(
      ({ secretId, nickname }) =>
        filterRows(secretId, searchValue) || filterRows(nickname, searchValue),
    );

  const chosenRespondentsItems =
    respondentsDataIndex || respondentsDataIndex === 0
      ? usersData?.items[respondentsDataIndex]
      : undefined;

  const appletsSmallTableRows = getAppletsSmallTableRows(
    chosenRespondentsItems,
    appletsData,
    setChosenAppletData,
  );

  useEffect(() => {
    const keys = chosenRespondentsItems && Object.keys(chosenRespondentsItems);
    if (keys && keys.length === 1) {
      const appletId = keys[0];
      const { appletName, secretUserId, hasIndividualSchedule, userId } = getChosenAppletData(
        chosenRespondentsItems,
        appletsData,
        appletId,
      );
      const chosenAppletData = {
        appletId,
        appletName,
        secretUserId,
        hasIndividualSchedule,
        userId,
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
      <Table columns={headCells} rows={handleFilterRows(rows)} orderBy="updated" />
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
        <RemoveAccessPopup
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
    </>
  );
};

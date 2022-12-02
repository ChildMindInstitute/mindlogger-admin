import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { Search } from 'components/Search';
import { Svg } from 'components/Svg';
import { Row, Table } from 'components/Table';
import { users, UserData, breadcrumbs } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { useTimeAgo, useBaseBreadcrumbs } from 'hooks';
import { filterRows } from 'utils/filterRows';
import { prepareUsersData } from 'utils/prepareUsersData';
import { Actions } from 'components/Actions';

import {
  RespondentsTableHeader,
  StyledButton,
  StyledLeftBox,
  StyledRightBox,
} from './RespondentsTable.styles';
import { actions, getHeadCells } from './RespondentsTable.const';

export const RespondentsTable = (): JSX.Element => {
  const { id } = useParams();
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const usersData = users.useUserData();
  const timeAgo = useTimeAgo();
  const baseBreadcrumbs = useBaseBreadcrumbs();
  const [searchValue, setSearchValue] = useState('');

  const handlePinClick = async (profileId: string, newState: boolean) => {
    const { updatePin, getUsersList } = users.thunk;
    const result = await dispatch(updatePin({ profileId, newState }));

    if (updatePin.fulfilled.match(result)) {
      dispatch(getUsersList());
    }
  };

  const usersArr = (
    id ? prepareUsersData(usersData?.items, id) : prepareUsersData(usersData?.items)
  ) as UserData[];

  const rows = usersArr?.map((user) => {
    const { pinned, MRN, nickName, updated, _id: profileId } = user;
    const lastEdited = updated ? timeAgo.format(new Date(updated)) : '';

    return {
      pin: {
        content: () =>
          pinned ? (
            <Svg width={12} height={16} id="pin" />
          ) : (
            <Svg width={12} height={16} id="pin-outlined" />
          ),
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
        content: () => <Actions items={actions} context={user} />,
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

  useEffect(() => {
    if (id && baseBreadcrumbs?.length > 0) {
      dispatch(
        breadcrumbs.actions.setBreadcrumbs([
          ...baseBreadcrumbs,
          {
            icon: <Svg id="respondent-outlined" width="13.5" height="15" />,
            label: t('respondents'),
          },
        ]),
      );
    }
  }, [baseBreadcrumbs]);

  return (
    <>
      <RespondentsTableHeader hasButton={!!id}>
        {id && (
          <StyledLeftBox>
            <StyledButton
              variant="outlined"
              startIcon={<Svg width={14} height={14} id="respondent-outlined" />}
            >
              {t('addRespondent')}
            </StyledButton>
          </StyledLeftBox>
        )}
        <Search placeholder={t('searchRespondents')} onSearch={handleSearch} />
        {id && <StyledRightBox />}
      </RespondentsTableHeader>
      <Table columns={getHeadCells(t)} rows={handleFilterRows(rows as Row[])} orderBy={'updated'} />
    </>
  );
};

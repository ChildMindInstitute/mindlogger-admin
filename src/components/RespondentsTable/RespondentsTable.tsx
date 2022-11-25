import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { Svg } from 'components/Svg';
import { Search } from 'components/Search';
import { Table } from 'components/Table';
import { useTimeAgo } from 'hooks';
import { UserData, users } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { Row } from 'components/Table';
import { filterRows } from 'utils/filterRows';

import {
  RespondentsTableHeader,
  StyledButton,
  StyledLeftBox,
  StyledRightBox,
} from './RespondentsTable.styles';
import { headCells } from './RespondentsTable.const';

export const RespondentsTable = (): JSX.Element => {
  const { id } = useParams();
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const timeAgo = useTimeAgo();
  const usersData = users.useUserData();
  const [searchValue, setSearchValue] = useState('');

  const handlePinClick = async (profileId: string, newState: boolean) => {
    const { updatePin, getUsersList } = users.thunk;
    const result = await dispatch(updatePin({ profileId, newState }));

    if (updatePin.fulfilled.match(result)) {
      dispatch(getUsersList());
    }
  };

  const usersArr = id
    ? usersData?.items.reduce((acc: UserData[] | null, currentValue) => {
        if (currentValue[id] && acc) {
          return acc.concat(currentValue[id]);
        }

        return null;
      }, [])
    : usersData?.items
        .map((item) => Object.values(item))
        .reduce((acc: UserData[] | null, currentValue) => {
          if (currentValue && acc) {
            return acc.concat(currentValue);
          }

          return null;
        }, []);

  const rows = usersArr?.map(({ pinned, MRN, nickName, updated, _id: profileId }) => {
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
        content: () => '',
        value: '',
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

  return (
    <>
      <RespondentsTableHeader>
        {id && (
          <StyledLeftBox>
            <StyledButton
              variant="roundedOutlined"
              startIcon={<Svg width={14} height={14} id="respondent" />}
            >
              {t('addRespondent')}
            </StyledButton>
          </StyledLeftBox>
        )}
        <Search placeholder={t('searchRespondents')} onSearch={handleSearch} />
        {id && <StyledRightBox />}
      </RespondentsTableHeader>
      <Table columns={headCells} rows={handleFilterRows(rows as Row[])} orderBy={'updated'} />
    </>
  );
};

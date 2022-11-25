import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';

import { Svg } from 'components/Svg';
import { account } from 'redux/modules';
import { Search } from 'components/Search';
import { Table } from 'components/Table';
import { useTimeAgo } from 'hooks';
import { filterRows } from 'utils/filterRows';
import { StyledFlexAllCenter } from 'styles/styledComponents/Flex';

import { headCells } from './AppletsTable.const';
import { AppletsTableHeader } from './AppletsTable.styles';

export const AppletsTable = (): JSX.Element => {
  const navigate = useNavigate();
  const { t } = useTranslation('app');
  const timeAgo = useTimeAgo();
  const accData = account.useData();
  const [searchValue, setSearchValue] = useState('');

  const handleAppletClick = (id: string) => navigate(`/${id}`);

  const formattedApplets = accData?.account?.applets?.map(({ id, displayName, updated }) => {
    const lastEdited = timeAgo.format(new Date(updated));

    return {
      appletName: {
        content: () => displayName,
        value: displayName,
        onClick: () => handleAppletClick(id),
      },
      lastEdited: {
        content: () => lastEdited,
        value: lastEdited,
        onClick: () => handleAppletClick(id),
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

  return (
    <>
      <AppletsTableHeader>
        <Search placeholder={t('searchApplets')} onSearch={handleSearch} />
        <StyledFlexAllCenter>
          <Button variant="roundedOutlined" startIcon={<Svg width={12} height={12} id="plus" />}>
            {t('addApplet')}
          </Button>
        </StyledFlexAllCenter>
      </AppletsTableHeader>
      <Table
        columns={headCells}
        rows={formattedApplets?.filter(({ appletName }) => filterRows(appletName, searchValue))}
        orderBy={'appletName'}
      />
    </>
  );
};

import { useTranslation } from 'react-i18next';

import { Search } from 'shared/components';
import { useTable } from 'shared/hooks';
import { Table } from 'modules/Dashboard/components';
import { variables } from 'shared/styles';

import { getHeadCells } from './ReportTable.const';
import { StyledTableWrapper } from './ReportTable.styles';

export const ReportTable = () => {
  const { t } = useTranslation('app');

  const { searchValue, handleSearch, ...tableProps } = useTable(async () => null);

  return (
    <>
      <Search
        background={variables.palette.outline_alfa8}
        placeholder={t('search')}
        onSearch={handleSearch}
      />
      <StyledTableWrapper>
        <Table rows={[]} columns={getHeadCells()} count={0} {...tableProps} />
      </StyledTableWrapper>
    </>
  );
};

import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { Search } from 'shared/components';
import { useTable } from 'shared/hooks';
import { Table } from 'modules/Dashboard/components';
import { theme, variables } from 'shared/styles';

import { getHeadCells } from './ReportTable.const';
import { StyledTableWrapper } from './ReportTable.styles';
import { ReportTableProps } from './ReportTable.types';
import { getRows } from './ReportTable.utils';

export const ReportTable = ({ answers = [] }: ReportTableProps) => {
  const { t } = useTranslation('app');

  const { searchValue, handleSearch, ...tableProps } = useTable(async () => null);

  return (
    <Box sx={{ mt: theme.spacing(2.4) }}>
      <Search
        background={variables.palette.outline_alfa8}
        placeholder={t('search')}
        onSearch={handleSearch}
      />
      <StyledTableWrapper>
        <Table rows={getRows(answers)} columns={getHeadCells()} count={3} {...tableProps} />
      </StyledTableWrapper>
    </Box>
  );
};

import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { Search } from 'shared/components';
import { DashboardTable } from 'modules/Dashboard/components';
import { StyledBodyMedium, theme, variables } from 'shared/styles';
import { Order } from 'shared/types';

import { StyledTableWrapper } from './ReportTable.styles';
import { ReportTableProps } from './ReportTable.types';
import { useResponseData } from './ReportTable.hooks';

export const ReportTable = ({
  responseType,
  answers = [],
  'data-testid': dataTestid,
}: ReportTableProps) => {
  const { t } = useTranslation('app');

  const [page, setPage] = useState(1);
  const [order, setOrder] = useState<Order>('desc');
  const [orderBy, setOrderBy] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const emptyState = searchValue ? t('noMatchWasFound', { searchValue }) : t('noData');

  const handleSearch = (searchValue: string) => {
    setPage(1);
    setSearchValue(searchValue);
  };

  const handleChangePage = (_: unknown, page: number) => {
    setPage(page + 1);
  };

  const handleRequestSort = (_: unknown, property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const skippedResponse = useMemo(
    () => (
      <StyledBodyMedium color={variables.palette.outline}>
        {t('respondentSkippedResponse')}
      </StyledBodyMedium>
    ),
    [t],
  );

  const { visibleRows, columns, count } = useResponseData({
    responseType,
    answers,
    searchValue,
    page,
    order,
    orderBy,
    skippedResponse,
  });

  return (
    <Box sx={{ mt: theme.spacing(2.4) }} data-testid={`${dataTestid}-table`}>
      <Search withDebounce placeholder={t('search')} onSearch={handleSearch} />
      <StyledTableWrapper>
        <DashboardTable
          page={page}
          order={order}
          orderBy={orderBy}
          rows={visibleRows}
          columns={columns}
          handleRequestSort={handleRequestSort}
          handleChangePage={handleChangePage}
          count={count}
          emptyComponent={visibleRows.length ? undefined : emptyState}
          maxHeight="37.5rem"
        />
      </StyledTableWrapper>
    </Box>
  );
};

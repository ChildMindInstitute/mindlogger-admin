import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import { format } from 'date-fns';

import { DEFAULT_ROWS_PER_PAGE, Search } from 'shared/components';
import { Table } from 'modules/Dashboard/components';
import { theme, variables } from 'shared/styles';
import { Order } from 'shared/types';
import { DateFormats } from 'shared/consts';

import { getHeadCells } from './ReportTable.const';
import { StyledTableWrapper } from './ReportTable.styles';
import { ReportTableProps, TextItemAnswer } from './ReportTable.types';
import { filterReportTable, getComparator, getRows, stableSort } from './ReportTable.utils';

export const ReportTable = ({ answers = [] }: ReportTableProps) => {
  const { t } = useTranslation('app');

  const [page, setPage] = useState(1);
  const [order, setOrder] = useState<Order>('desc');
  const [orderBy, setOrderBy] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (searchValue: string) => {
    setSearchValue(searchValue);
  };

  const handleChangePage = (_: unknown, page: number) => {
    setPage(page);
  };

  const handleRequestSort = (_: unknown, property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const visibleRows = useMemo(() => {
    const currentPage = page - 1;
    const formattedAnswers = answers.reduce((textItemAnswers: TextItemAnswer[], answer) => {
      const date = format(new Date(answer.date), DateFormats.DayMonthYear);
      const time = format(new Date(answer.date), DateFormats.Time);

      if (!filterReportTable(`${date} ${time} ${answer.value}`, searchValue))
        return textItemAnswers;

      return [
        ...textItemAnswers,
        {
          date,
          time,
          response: answer.value as string,
        },
      ];
    }, []);

    const visibleAnswers = stableSort(formattedAnswers, getComparator(order, orderBy)).slice(
      currentPage * DEFAULT_ROWS_PER_PAGE,
      currentPage * DEFAULT_ROWS_PER_PAGE + DEFAULT_ROWS_PER_PAGE,
    );

    return getRows(visibleAnswers);
  }, [answers, searchValue, page, order, orderBy]);

  return (
    <Box sx={{ mt: theme.spacing(2.4) }}>
      <Search
        background={variables.palette.outline_alfa8}
        placeholder={t('search')}
        onSearch={handleSearch}
      />
      <StyledTableWrapper>
        <Table
          page={page}
          order={order}
          orderBy={orderBy}
          rows={visibleRows}
          columns={getHeadCells()}
          handleRequestSort={handleRequestSort}
          handleChangePage={handleChangePage}
          count={answers.length}
        />
      </StyledTableWrapper>
    </Box>
  );
};

import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import { format } from 'date-fns';

import { Search } from 'shared/components';
import { DashboardTable } from 'modules/Dashboard/components';
import { StyledBodyMedium, theme, variables } from 'shared/styles';
import { Order } from 'shared/types';
import { DateFormats, DEFAULT_ROWS_PER_PAGE } from 'shared/consts';

import { getHeadCells } from './ReportTable.const';
import { StyledTableWrapper } from './ReportTable.styles';
import { ReportTableProps, TextItemAnswer } from './ReportTable.types';
import { filterReportTable, getComparator, getRows, stableSort } from './ReportTable.utils';
import { Answer } from '../Report.types';

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
    const formattedAnswers = answers?.reduce(
      (textItemAnswers: TextItemAnswer[], { answer, date: answerDate }: Answer) => {
        const date = format(new Date(answerDate), DateFormats.DayMonthYear);
        const time = format(new Date(answerDate), DateFormats.Time);

        if (!filterReportTable(`${date} ${time} ${answer.value}`, searchValue)) {
          return textItemAnswers;
        }

        return [
          ...textItemAnswers,
          {
            date,
            time,
            answer: answer.value || '',
          },
        ];
      },
      [],
    );

    const visibleAnswers = stableSort(formattedAnswers, getComparator(order, orderBy)).slice(
      currentPage * DEFAULT_ROWS_PER_PAGE,
      currentPage * DEFAULT_ROWS_PER_PAGE + DEFAULT_ROWS_PER_PAGE,
    );

    const skippedResponse = (
      <StyledBodyMedium color={variables.palette.outline}>
        {t('respondentSkippedResponse')}
      </StyledBodyMedium>
    );

    return getRows(visibleAnswers, skippedResponse);
  }, [answers, searchValue, page, order, orderBy]);

  return (
    <Box sx={{ mt: theme.spacing(2.4) }}>
      <Search placeholder={t('search')} onSearch={handleSearch} />
      <StyledTableWrapper>
        <DashboardTable
          page={page}
          order={order}
          orderBy={orderBy}
          rows={visibleRows}
          columns={getHeadCells()}
          handleRequestSort={handleRequestSort}
          handleChangePage={handleChangePage}
          count={answers.length}
          emptyComponent={visibleRows.length ? undefined : <>{t('noData')}</>}
        />
      </StyledTableWrapper>
    </Box>
  );
};

import { useState, MouseEvent, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import {
  TableContainer,
  Table as MuiTable,
  TableBody,
  TablePagination,
  TableRow,
  TableCell,
} from '@mui/material';
import uniqueId from 'lodash.uniqueid';

import {
  DEFAULT_LABEL_ROWS_PER_PAGE,
  DEFAULT_ROWS_PER_PAGE,
  DEFAULT_ROWS_PER_PAGE_OPTIONS,
} from 'components/Table/Table.const';
import { Head } from 'components/Table/Head';
import { Order, Row, TableProps } from './Table.types';

export const Table = ({ columns, rows, options, orderBy: orderByProp }: TableProps) => {
  const { t } = useTranslation('app');
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<string>(orderByProp);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(options?.rowsPerPage || DEFAULT_ROWS_PER_PAGE);

  function descendingComparator(a: Row, b: Row, orderBy: string) {
    if (b[orderBy].value < a[orderBy].value) {
      return -1;
    }
    if (b[orderBy].value > a[orderBy].value) {
      return 1;
    }

    return 0;
  }

  function getComparator(order: Order, orderBy: string): (a: Row, b: Row) => number {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  const handleRequestSort = (event: MouseEvent<unknown>, property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <TableContainer>
        <MuiTable>
          <Head
            headCells={columns}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {rows
              ?.sort(getComparator(order, orderBy))
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={uniqueId('row_')}>
                  {Object.keys(row)?.map((key) => (
                    <TableCell
                      onClick={row[key].onClick}
                      scope="row"
                      key={key}
                      align={row[key].align}
                    >
                      {row[key].content()}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </MuiTable>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={DEFAULT_ROWS_PER_PAGE_OPTIONS}
        component="div"
        count={rows?.length || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={t(DEFAULT_LABEL_ROWS_PER_PAGE)}
      />
    </>
  );
};

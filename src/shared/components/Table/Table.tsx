import { ChangeEvent, MouseEvent, useState } from 'react';
import { Table as MuiTable, TableBody, TableCell, TablePagination, TableRow } from '@mui/material';

import { Order } from 'shared/types/table';
import { EmptyState } from 'shared/components/EmptyState';
import { DEFAULT_ROWS_PER_PAGE, MAX_LIMIT } from 'shared/consts';

import { TableHead } from './TableHead';
import { SEVEN_ROWS_PER_PAGE } from './Table.const';
import { StyledTableCellContent, StyledTableContainer } from './Table.styles';
import { Row, TableProps, UiType } from './Table.types';

export const Table = ({
  columns,
  rows,
  keyExtractor = (item: Row, index: number) => `row-${index}`,
  order: orderProp = 'asc',
  orderBy: orderByProp,
  maxHeight = '100%',
  uiType = UiType.Primary,
  emptyComponent,
  className = '',
  tableHeadBg,
  'data-testid': dataTestid,
}: TableProps) => {
  const [order, setOrder] = useState<Order>(orderProp);
  const [orderBy, setOrderBy] = useState<string>(orderByProp);
  const [page, setPage] = useState(0);
  const getRowsPerPage = () => {
    if (uiType === UiType.Secondary) return MAX_LIMIT;
    if (uiType === UiType.Tertiary || uiType === UiType.Quaternary) return SEVEN_ROWS_PER_PAGE;

    return DEFAULT_ROWS_PER_PAGE;
  };
  const [rowsPerPage, setRowsPerPage] = useState(getRowsPerPage());

  const descendingComparator = (a: Row, b: Row, orderBy: string) => {
    const valueA = a[orderBy]?.value;
    const valueB = b[orderBy]?.value;

    if (valueB === undefined || valueA === undefined) return 0;

    // check if values are valid dates (string or number)
    const isValueADate = typeof valueA === 'string' || typeof valueA === 'number';
    const isValueBDate = typeof valueB === 'string' || typeof valueB === 'number';

    if (isValueADate && isValueBDate) {
      const dateA = new Date(valueA).getTime();
      const dateB = new Date(valueB).getTime();

      // compare dates if both are valid
      if (!isNaN(dateA) && !isNaN(dateB)) {
        return dateA < dateB ? 1 : -1;
      }
    }

    // fallback to string or number comparison
    if (valueB < valueA) return -1;
    if (valueB > valueA) return 1;

    return 0;
  };

  const getComparator = (order: Order, orderBy: string): ((a: Row, b: Row) => number) =>
    order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);

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

  const tableHeader = (
    <StyledTableCellContent uiType={uiType}>
      <TablePagination
        component="div"
        count={rows?.length || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage=""
        rowsPerPageOptions={[]}
      />
    </StyledTableCellContent>
  );

  return (
    <>
      <StyledTableContainer className={className} maxHeight={maxHeight} uiType={uiType}>
        {rows?.length ? (
          <MuiTable stickyHeader data-testid={dataTestid}>
            <TableHead
              headCells={columns}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              tableHeader={tableHeader}
              uiType={uiType}
              tableHeadBg={tableHeadBg}
            />
            <TableBody>
              {rows
                ?.sort(getComparator(order, orderBy))
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const { rowState, ...cells } = row;

                  return (
                    <TableRow
                      key={keyExtractor(row, index)}
                      classes={
                        rowState?.value ? { root: `MuiTableRow-${rowState.value}` } : undefined
                      }
                      aria-invalid={rowState?.value === 'error'}
                      data-testid={`table-row-${index}`}
                    >
                      {Object.keys(cells)?.map((key) =>
                        row[key].isHidden ? null : (
                          <TableCell
                            sx={{ height: '4.8rem', maxWidth: row[key].maxWidth }}
                            onClick={row[key].onClick}
                            scope="row"
                            key={key}
                            align={row[key].align}
                            width={row[key].width}
                          >
                            {row[key].content?.(row)}
                          </TableCell>
                        ),
                      )}
                    </TableRow>
                  );
                })}
            </TableBody>
          </MuiTable>
        ) : (
          <EmptyState>{emptyComponent}</EmptyState>
        )}
      </StyledTableContainer>
      {uiType === UiType.Tertiary && tableHeader}
    </>
  );
};

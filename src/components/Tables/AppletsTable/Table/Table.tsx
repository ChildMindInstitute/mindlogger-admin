import { useMemo, useState } from 'react';
import { Table as MuiTable, TableBody, TablePagination } from '@mui/material';

import { DEFAULT_ROWS_PER_PAGE, Head } from 'components/Tables';
import { Order } from 'types/table';
import { getComparator, sortRows } from '../AppletsTable.utils';

import { StyledTableContainer, StyledCellItem, StyledTableCellContent } from './Table.styles';
import { TableProps } from './Table.types';
import { FolderItem } from './FolderItem';
import { AppletItem } from './AppletItem';

export const Table = ({
  columns,
  rows,
  orderBy: orderByProp,
  headerContent,
  onRowClick,
}: TableProps) => {
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<string>(orderByProp);
  const [page, setPage] = useState(0);

  const sortedRows = useMemo(() => {
    if (!rows?.length) {
      return [];
    }
    return sortRows(rows, getComparator(order, orderBy));
  }, [order, orderBy, rows?.length]);

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const tableHeader = (
    <StyledTableCellContent>
      {headerContent && <StyledCellItem>{headerContent}</StyledCellItem>}
      <StyledCellItem>
        <TablePagination
          component="div"
          count={rows?.length || 0}
          rowsPerPage={DEFAULT_ROWS_PER_PAGE}
          page={page}
          onPageChange={handleChangePage}
          labelRowsPerPage=""
          rowsPerPageOptions={[]}
        />
      </StyledCellItem>
    </StyledTableCellContent>
  );

  return (
    <>
      <StyledTableContainer>
        <MuiTable stickyHeader>
          <Head
            headCells={columns}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            tableHeader={tableHeader}
          />
          <TableBody>
            {sortedRows
              ?.slice(
                page * DEFAULT_ROWS_PER_PAGE,
                page * DEFAULT_ROWS_PER_PAGE + DEFAULT_ROWS_PER_PAGE,
              )
              .map((row) =>
                row?.isFolder ? (
                  <FolderItem onRowClick={onRowClick} key={row.id} item={row} />
                ) : (
                  <AppletItem key={row.id} item={row} />
                ),
              )}
          </TableBody>
        </MuiTable>
      </StyledTableContainer>
    </>
  );
};

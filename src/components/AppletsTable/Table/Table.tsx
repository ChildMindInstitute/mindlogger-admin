import { useState } from 'react';
import { Table as MuiTable, TableBody, TablePagination } from '@mui/material';

import { DEFAULT_ROWS_PER_PAGE } from 'components/Table/Table.const';
import { Head } from 'components/Table/Head';
import { FoldersApplets } from 'redux/modules';
import { Order } from 'types/table';

import { StyledTableContainer, StyledCellItem, StyledTableCellContent } from './Table.styles';
import { TableProps } from './Table.types';
import { FolderItem } from './FolderItem';
import { AppletItem } from './AppletItem';

export const Table = ({ columns, rows, orderBy: orderByProp, headerContent }: TableProps) => {
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<string>(orderByProp);
  const [page, setPage] = useState(0);

  function descendingComparator(a: FoldersApplets, b: FoldersApplets, orderBy: string) {
    if (b[orderBy as keyof FoldersApplets]! < a[orderBy as keyof FoldersApplets]!) {
      return -1;
    }
    if (b[orderBy as keyof FoldersApplets]! > a[orderBy as keyof FoldersApplets]!) {
      return 1;
    }

    return 0;
  }

  function getComparator(
    order: Order,
    orderBy: string,
  ): (a: FoldersApplets, b: FoldersApplets) => number {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

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
            {rows
              ?.sort(getComparator(order, orderBy))
              ?.slice(
                page * DEFAULT_ROWS_PER_PAGE,
                page * DEFAULT_ROWS_PER_PAGE + DEFAULT_ROWS_PER_PAGE,
              )
              .map((row) =>
                row?.isFolder ? (
                  <FolderItem key={row.id} item={row} />
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

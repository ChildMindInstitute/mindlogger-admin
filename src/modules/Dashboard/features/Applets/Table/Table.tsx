import { Fragment, MouseEvent } from 'react';
import { Table as MuiTable, TableBody, TablePagination } from '@mui/material';

import { applets, FolderApplet } from 'redux/modules';
import { DEFAULT_ROWS_PER_PAGE, EmptyTable, TableHead } from 'shared/components';

import { OrderBy } from '../Applets.types';
import { StyledCellItem, StyledTableCellContent, StyledTableContainer } from './Table.styles';
import { TableProps } from './Table.types';
import { FolderItem } from './FolderItem';
import { AppletItem } from './AppletItem';

export const Table = ({
  columns,
  rows,
  order,
  setOrder,
  orderBy,
  setOrderBy,
  headerContent,
  emptyComponent,
  page,
  setPage,
  count,
}: TableProps) => {
  const status = applets.useStatus();
  const loading = status === 'idle' || status === 'loading';

  const handleRequestSort = (event: MouseEvent<unknown>, property: string) => {
    const orderByValue = property === 'name' ? OrderBy.DisplayName : OrderBy.UpdatedAt;
    const isAsc = order === 'asc' && orderBy === orderByValue;

    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(orderByValue);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage + 1);
  };

  const tableHeader = (
    <StyledTableCellContent>
      {headerContent && <StyledCellItem>{headerContent}</StyledCellItem>}
      <StyledCellItem>
        <TablePagination
          component="div"
          count={count}
          rowsPerPage={DEFAULT_ROWS_PER_PAGE}
          page={page - 1}
          onPageChange={handleChangePage}
          labelRowsPerPage=""
          rowsPerPageOptions={[]}
        />
      </StyledCellItem>
    </StyledTableCellContent>
  );

  const getRowComponent = (row: FolderApplet) =>
    row?.isFolder ? <FolderItem item={row} /> : <AppletItem item={row} />;

  const getEmptyTable = () => {
    if (!loading && rows) {
      return <EmptyTable>{emptyComponent}</EmptyTable>;
    }
  };

  return (
    <StyledTableContainer>
      {rows?.length ? (
        <MuiTable stickyHeader>
          <TableHead
            headCells={columns}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            tableHeader={tableHeader}
          />
          <TableBody>
            {rows.map((row: FolderApplet) => (
              <Fragment key={row.id}>{getRowComponent(row)}</Fragment>
            ))}
          </TableBody>
        </MuiTable>
      ) : (
        getEmptyTable()
      )}
    </StyledTableContainer>
  );
};

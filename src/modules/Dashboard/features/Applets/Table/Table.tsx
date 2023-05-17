import { Fragment, useMemo } from 'react';
import { Table as MuiTable, TableBody, TablePagination } from '@mui/material';

import { folders, FolderApplet } from 'redux/modules';
import { DEFAULT_ROWS_PER_PAGE, EmptyTable, TableHead } from 'shared/components';

import { StyledCellItem, StyledTableCellContent, StyledTableContainer } from './Table.styles';
import { TableProps } from './Table.types';
import { FolderItem } from './FolderItem';
import { AppletItem } from './AppletItem';
import { getComparator, sortRows } from './Table.utils';

export const Table = ({
  columns,
  rows,
  order,
  orderBy,
  headerContent,
  emptyComponent,
  page,
  count,
  handleRequestSort,
  handleChangePage,
}: TableProps) => {
  const status = folders.useStatus();

  const sortedRows = useMemo(() => {
    if (!rows?.length) {
      return [];
    }

    return sortRows(rows, getComparator(order, orderBy));
  }, [order, orderBy, rows]);

  const loading = status === 'idle' || status === 'loading';

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
            {sortedRows?.map((row: FolderApplet) => (
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

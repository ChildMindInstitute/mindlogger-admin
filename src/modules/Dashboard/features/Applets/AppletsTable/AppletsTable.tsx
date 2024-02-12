import { Fragment } from 'react';

import { Table as MuiTable, TableBody, TablePagination } from '@mui/material';

import { EmptyState, TableHead } from 'shared/components';
import { DEFAULT_ROWS_PER_PAGE } from 'shared/consts';
import { Applet, Folder } from 'api';

import {
  StyledCellItem,
  StyledTableCellContent,
  StyledTableContainer,
} from './AppletsTable.styles';
import { AppletsTableProps } from './AppletsTable.types';
import { FolderItem } from './FolderItem';
import { AppletItem } from './AppletItem';

export const AppletsTable = ({
  columns,
  rows,
  order,
  orderBy,
  headerContent,
  emptyComponent,
  page,
  count,
  rowsPerPage,
  handleRequestSort,
  handleChangePage,
  handleReload,
  'data-testid': dataTestid,
}: AppletsTableProps) => {
  const perPage =
    rowsPerPage && rowsPerPage > DEFAULT_ROWS_PER_PAGE ? rowsPerPage : DEFAULT_ROWS_PER_PAGE;

  const tableHeader = (
    <StyledTableCellContent>
      {headerContent && <StyledCellItem>{headerContent}</StyledCellItem>}
      <StyledCellItem>
        <TablePagination
          component="div"
          count={count}
          rowsPerPage={perPage}
          page={page - 1}
          onPageChange={handleChangePage}
          labelRowsPerPage=""
          rowsPerPageOptions={[]}
        />
      </StyledCellItem>
    </StyledTableCellContent>
  );

  const getRowComponent = (row: Folder | Applet) =>
    row?.isFolder ? (
      <FolderItem item={row as Folder} />
    ) : (
      <AppletItem item={row as Applet} onPublish={handleReload} />
    );

  const getEmptyTable = () => <EmptyState>{emptyComponent}</EmptyState>;

  return (
    <StyledTableContainer>
      {!!rows?.length && (
        <MuiTable data-testid={dataTestid}>
          <TableHead
            headCells={columns}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            tableHeader={tableHeader}
            hasColFixedWidth
          />
          <TableBody>
            {rows.map((row, index) => (
              <Fragment key={`row-${row.id}-${index}`}>{getRowComponent(row)}</Fragment>
            ))}
          </TableBody>
        </MuiTable>
      )}
      {emptyComponent && getEmptyTable()}
    </StyledTableContainer>
  );
};

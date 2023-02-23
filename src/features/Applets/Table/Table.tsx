import { Fragment, MouseEvent } from 'react';
import { Table as MuiTable, TableBody, TablePagination } from '@mui/material';

import { FolderApplet } from 'redux/modules';
import { DEFAULT_ROWS_PER_PAGE, Head } from 'components';
// import { Order } from 'types/table';
import { EmptyTable } from 'components';

// import { getComparator, sortRows } from '../Applets.utils';
import { StyledTableContainer, StyledCellItem, StyledTableCellContent } from './Table.styles';
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
}: TableProps) => {
  // const [order, setOrder] = useState<Order>('desc');
  // const [orderBy, setOrderBy] = useState<string>(orderByProp);
  // const [page, setPage] = useState(0);

  // console.log('rows', rows);

  // const sortedRows = useMemo(() => {
  //   if (!rows?.length) {
  //     return [];
  //   }
  //
  //   return sortRows(rows, getComparator(order, orderBy));
  // }, [order, orderBy, rows]);

  const handleRequestSort = (event: MouseEvent<unknown>, property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
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
          // TODO: implement total count from response when API is ready
          // count={rows?.length || 0}
          count={200}
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

  return (
    <StyledTableContainer>
      {/*{sortedRows.length ? (*/}
      {rows?.length ? (
        <MuiTable stickyHeader>
          <Head
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
        <EmptyTable>{emptyComponent}</EmptyTable>
      )}
    </StyledTableContainer>
  );
};

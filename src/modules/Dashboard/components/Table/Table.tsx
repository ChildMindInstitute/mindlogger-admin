import { Table as MuiTable, TableBody, TableCell, TablePagination, TableRow } from '@mui/material';

import {
  DEFAULT_ROWS_PER_PAGE,
  EmptyTable,
  TableHead,
  UiType,
  StyledTableCellContent,
  StyledTableContainer,
} from 'shared/components';

import { TableProps } from './Table.types';

// TODO: make rows rendering more strict
export const Table = ({
  columns,
  rows,
  maxHeight = '100%',
  uiType = UiType.Primary,
  className = '',
  order,
  orderBy,
  handleRequestSort,
  emptyComponent,
  page,
  setPage,
  count,
}: TableProps) => {
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage + 1);
  };

  const tableHeader = (
    <StyledTableCellContent uiType={uiType}>
      <TablePagination
        component="div"
        count={count}
        rowsPerPage={DEFAULT_ROWS_PER_PAGE}
        page={page - 1}
        onPageChange={handleChangePage}
        labelRowsPerPage=""
        rowsPerPageOptions={[]}
      />
    </StyledTableCellContent>
  );

  return (
    <>
      <StyledTableContainer className={className} maxHeight={maxHeight} uiType={uiType}>
        {rows?.length ? (
          <MuiTable stickyHeader>
            <TableHead
              headCells={columns}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              tableHeader={tableHeader}
              uiType={uiType}
            />
            <TableBody>
              {rows?.map((row, index) => (
                <TableRow key={`row-${index}`}>
                  {Object.keys(row)?.map((key) => (
                    <TableCell
                      onClick={row[key].onClick}
                      scope="row"
                      key={key}
                      align={row[key].align}
                      width={row[key].width}
                    >
                      {row[key].content(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </MuiTable>
        ) : (
          <EmptyTable>{emptyComponent}</EmptyTable>
        )}
      </StyledTableContainer>
      {uiType === UiType.Tertiary && tableHeader}
    </>
  );
};

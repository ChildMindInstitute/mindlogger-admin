import { Table as MuiTable, TableBody, TablePagination, TableRow } from '@mui/material';

import {
  EmptyState,
  TableHead,
  UiType,
  StyledTableCellContent,
  StyledTableContainer,
} from 'shared/components';
import { DEFAULT_ROWS_PER_PAGE } from 'shared/consts';

import { DashboardTableProps } from './DashboardTable.types';
import { StyledTableCell } from './DashboardTable.styles';

export const DashboardTable = ({
  columns,
  rows,
  maxHeight = '100%',
  uiType = UiType.Primary,
  className = '',
  order,
  orderBy,
  emptyComponent,
  page,
  handleRequestSort,
  handleChangePage,
  count,
  hasColFixedWidth,
  rowsPerPage = DEFAULT_ROWS_PER_PAGE,
  onScroll,
  'data-testid': dataTestid,
}: DashboardTableProps) => {
  const tableHeader = (
    <StyledTableCellContent uiType={uiType}>
      <TablePagination
        component="div"
        count={count}
        rowsPerPage={rowsPerPage}
        page={page - 1}
        onPageChange={handleChangePage}
        labelRowsPerPage=""
        rowsPerPageOptions={[]}
        data-testid={`${dataTestid}-table-pagination`}
      />
    </StyledTableCellContent>
  );

  return (
    <StyledTableContainer
      className={className}
      maxHeight={maxHeight}
      uiType={uiType}
      hasColFixedWidth={hasColFixedWidth}
      onScroll={onScroll}
    >
      {!!rows?.length && (
        <MuiTable stickyHeader data-testid={dataTestid}>
          <TableHead
            headCells={columns}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            tableHeader={tableHeader}
            uiType={uiType}
            hasColFixedWidth={hasColFixedWidth}
          />
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={`row-${index}`}>
                {Object.keys(row)?.map((key) => (
                  <StyledTableCell
                    onClick={row[key].onClick}
                    scope="row"
                    key={key}
                    align={row[key].align}
                    width={row[key].width}
                    hasColFixedWidth={hasColFixedWidth}
                    sx={{ cursor: row[key].onClick ? 'pointer' : 'default' }}
                  >
                    {row[key].contentWithTooltip
                      ? row[key].contentWithTooltip
                      : row[key].content(row)}
                  </StyledTableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </MuiTable>
      )}
      {emptyComponent && <EmptyState>{emptyComponent}</EmptyState>}
    </StyledTableContainer>
  );
};

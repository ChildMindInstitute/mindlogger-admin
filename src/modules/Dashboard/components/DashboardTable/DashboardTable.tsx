import { Table as MuiTable, TableBody, TablePagination, TableRow } from '@mui/material';

import { UiType, StyledTableCellContent, StyledTableContainer, Row } from 'shared/components/Table';
import { EmptyState } from 'shared/components/EmptyState';
import { DEFAULT_ROWS_PER_PAGE } from 'shared/consts';
import { StyledEllipsisText } from 'shared/styles';

import { DashboardTableProps } from './DashboardTable.types';
import { StyledTableCell, StyledTableHead } from './DashboardTable.styles';

export const DashboardTable = ({
  columns,
  rows,
  keyExtractor = (_row: Row, index: number) => `row-${index}`,
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
      sx={{ height: rows?.length ? 'auto' : '100%' }}
    >
      {!!rows?.length && (
        <MuiTable stickyHeader data-testid={dataTestid}>
          <StyledTableHead
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
              <TableRow key={keyExtractor(row, index)}>
                {Object.keys(row)?.map((key) => {
                  if (row[key].isHidden) {
                    return null;
                  }

                  const { contentWithTooltip, content, maxWidth, sx, ...otherProps } = row[key];

                  return (
                    <StyledTableCell
                      scope="row"
                      key={key}
                      {...otherProps}
                      hasColFixedWidth={hasColFixedWidth}
                      sx={{
                        cursor: otherProps.onClick ? 'pointer' : 'default',
                        maxWidth,
                        ...sx,
                      }}
                      data-testid={`${dataTestid}-${index}-cell-${key}`}
                    >
                      <StyledEllipsisText as="div">
                        {contentWithTooltip ? contentWithTooltip : content?.(row)}
                      </StyledEllipsisText>
                    </StyledTableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </MuiTable>
      )}
      {emptyComponent && <EmptyState icon="profile">{emptyComponent}</EmptyState>}
    </StyledTableContainer>
  );
};

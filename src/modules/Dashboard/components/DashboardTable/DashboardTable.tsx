import { Table as MuiTable, TableBody, TablePagination, TableRow } from '@mui/material';

import { UiType, StyledTableCellContent, StyledTableContainer, Row } from 'shared/components/Table';
import { EmptyState } from 'shared/components/EmptyState';
import { DEFAULT_ROWS_PER_PAGE } from 'shared/consts';
import { StyledEllipsisText } from 'shared/styles';

import { DashboardTableProps } from './DashboardTable.types';
import { StyledTableCell, StyledTableHead } from './DashboardTable.styles';

export const DashboardTable = (props: DashboardTableProps) => {
  const {
    'data-testid': dataTestid,
    className,
    columns,
    emptyComponent,
    enablePagination = true,
    handleRequestSort,
    hasColFixedWidth,
    keyExtractor = (_row: Row, index: number) => `row-${index}`,
    maxHeight = '100%',
    onScroll,
    order,
    orderBy,
    rows = [],
    rowsPerPage = DEFAULT_ROWS_PER_PAGE,
    uiType = UiType.Primary,
  } = props;

  const tableHeader =
    props.enablePagination === false ? null : (
      <StyledTableCellContent uiType={uiType}>
        <TablePagination
          component="div"
          count={props.count}
          rowsPerPage={rowsPerPage}
          page={(props.page ?? 1) - 1}
          onPageChange={props.handleChangePage}
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
            enablePagination={enablePagination}
            hasColFixedWidth={hasColFixedWidth}
            headCells={columns}
            onRequestSort={handleRequestSort}
            order={order}
            orderBy={orderBy}
            tableHeader={tableHeader}
            uiType={uiType}
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

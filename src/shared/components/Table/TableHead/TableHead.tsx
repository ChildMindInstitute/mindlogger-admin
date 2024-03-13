import { MouseEvent } from 'react';
import { TableRow, TableCell, TableSortLabel } from '@mui/material';

import { UiType } from '../Table.types';
import { StyledTableCell, StyledTableHead } from './TableHead.styles';
import { TableHeadProps } from './TableHead.types';

export const TableHead = ({
  tableHeader,
  headCells,
  order,
  orderBy,
  onRequestSort,
  uiType = UiType.Primary,
  hasColFixedWidth,
  tableHeadBg,
}: TableHeadProps) => {
  const createSortHandler = (property: string) => (event: MouseEvent<unknown>) =>
    onRequestSort(event, property);

  return (
    <StyledTableHead uiType={uiType} hasColFixedWidth={hasColFixedWidth} tableHeadBg={tableHeadBg}>
      {(uiType === UiType.Primary || uiType === UiType.Quaternary) && (
        <TableRow>
          <TableCell sx={{ flexGrow: 1 }} colSpan={headCells.length}>
            {tableHeader}
          </TableCell>
        </TableRow>
      )}
      <TableRow>
        {headCells.map(({ id, label, align, enableSort, width }) => (
          <StyledTableCell
            uiType={uiType}
            key={id}
            width={width}
            align={align}
            sortDirection={orderBy === id ? order : false}
            hasColFixedWidth={hasColFixedWidth}
          >
            {enableSort ? (
              <TableSortLabel
                active={orderBy === id}
                direction={orderBy === id ? order : 'asc'}
                onClick={createSortHandler(id)}
              >
                {label}
              </TableSortLabel>
            ) : (
              <>{label}</>
            )}
          </StyledTableCell>
        ))}
      </TableRow>
    </StyledTableHead>
  );
};

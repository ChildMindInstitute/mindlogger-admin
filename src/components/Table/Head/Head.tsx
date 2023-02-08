import { TableRow, TableCell, TableSortLabel } from '@mui/material';

import { UiType } from '../Table.types';
import { StyledTableCell, StyledTableHead } from './Head.styles';
import { HeadProps } from './Head.types';

export const Head = ({
  tableHeader,
  headCells,
  order,
  orderBy,
  onRequestSort,
  uiType = UiType.Primary,
}: HeadProps): JSX.Element => {
  const createSortHandler = (property: string) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <StyledTableHead uiType={uiType}>
      {uiType === UiType.Primary && (
        <TableRow>
          <TableCell colSpan={headCells.length}>{tableHeader}</TableCell>
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

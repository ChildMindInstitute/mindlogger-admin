import { TableRow, TableCell, TableHead, TableSortLabel } from '@mui/material';
import { HeadProps } from './Head.types';

export const Head = ({ headCells, order, orderBy, onRequestSort }: HeadProps): JSX.Element => {
  const createSortHandler = (property: string) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map(({ id, label, align, enableSort, width }) => (
          <TableCell
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
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

import { Box, styled, TableCell, TableContainer } from '@mui/material';

import { variables, StyledFlexTopCenter } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';

export const StyledTableContainer = styled(TableContainer)`
  display: flex;
  flex-direction: column;
  height: 100%;
  border-radius: ${variables.borderRadius.lg2};

  .MuiTable-root,
  .MuiTableBody-root {
    display: block;
  }

  .MuiTableRow-root {
    display: flex;
  }

  .MuiTableCell-head {
    background: ${variables.palette.surface};
  }
`;

export const StyledTableCellContent = styled(Box)`
  display: flex;
  justify-content: space-between;
`;

export const StyledCellItem = styled(StyledFlexTopCenter)`
  cursor: pointer;
`;

export const StyledTableCell = styled(TableCell, shouldForwardProp)`
  display: flex;
  align-items: center;
  flex-basis: ${({ width }) => width};
  flex-grow: ${({ width }) => (width ? 'unset' : 1)};
`;

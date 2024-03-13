import { Box, styled, TableCell, TableContainer } from '@mui/material';

import { variables, StyledFlexTopCenter } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';
import { tableRowHoverColor } from 'shared/utils/colors';

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

  && .MuiTableRow-root.has-hover {
    cursor: pointer;

    &:hover {
      background-color: ${tableRowHoverColor};
    }
  }

  && .MuiTableRow-root.dragged-over {
    .MuiTableCell-body {
      border-top: ${variables.borderWidth.lg} solid ${variables.palette.primary};
      border-bottom: ${variables.borderWidth.lg} solid ${variables.palette.primary};
    }

    .MuiTableCell-body:first-of-type {
      border-left: ${variables.borderWidth.lg} solid ${variables.palette.primary};
      border-top-left-radius: ${variables.borderRadius.xs} ${variables.borderRadius.xs};
      border-bottom-left-radius: ${variables.borderRadius.xs} ${variables.borderRadius.xs};
    }

    .MuiTableCell-body:last-of-type {
      border-right: ${variables.borderWidth.lg} solid ${variables.palette.primary};
      border-top-right-radius: ${variables.borderRadius.xs} ${variables.borderRadius.xs};
      border-bottom-right-radius: ${variables.borderRadius.xs} ${variables.borderRadius.xs};
    }
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

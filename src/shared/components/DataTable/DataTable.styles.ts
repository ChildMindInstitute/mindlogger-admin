import { Checkbox, styled, TableCell, TableContainer } from '@mui/material';

import { variables } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';

const height = '29.2rem';

export const StyledTableContainer = styled(TableContainer, shouldForwardProp)`
  border: ${({ hasError }: { hasError?: boolean }) =>
    hasError
      ? `${variables.borderWidth.lg} solid ${variables.palette.error};`
      : `${variables.borderWidth.md} solid ${variables.palette.outline_variant};`};
  border-radius: ${variables.borderRadius.lg2};
  min-height: ${height};
  max-height: ${height};
  /* Ensure rounded corners clip sticky header/background and avoid visual gaps */
  overflow: hidden; /* clip all sides */
  overflow-y: auto; /* but keep vertical scrolling */
  background-color: ${variables.palette.surface1};

  .MuiTable-root {
    table-layout: fixed;
    width: 100%;
  }

  .MuiTableCell-root {
    background-color: transparent;
    height: 4.8rem;
  }
`;

export const StyledCheckbox = styled(Checkbox)`
  & svg {
    fill: ${variables.palette.primary};
  }
`;

export const StyledTableCell = styled(TableCell)`
  /* Allow column widths to be driven by colgroup or inline styles */
  max-width: unset;
  width: auto;
  min-width: 0; /* enable text truncation inside percent-based columns */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const StyledHeadCell = styled(TableCell, shouldForwardProp)`
  && {
    &.MuiTableCell-head {
      background-color: ${({ tableHeadBackground }: { tableHeadBackground?: string }) =>
        tableHeadBackground ?? variables.palette.surface1};
    }
  }
`;

import { Checkbox, styled, TableCell, TableContainer } from '@mui/material';

import { theme, variables } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';

const height = '29.2rem';

export const StyledTableContainer = styled(TableContainer, shouldForwardProp)`
  border: ${({ hasError }: { hasError?: boolean }) =>
    hasError
      ? `${variables.borderWidth.lg} solid ${variables.palette.semantic.error};`
      : `${variables.borderWidth.md} solid ${variables.palette.outline_variant};`}
  border-radius: ${variables.borderRadius.lg2};
  min-height: ${height};
  max-height: ${height};

  .MuiTableCell-root {
    background-color: transparent;
  }

  .MuiTableRow-root {
    &:hover {
      background-color: ${variables.palette.on_surface_alfa8};
    }
  }

  .empty-state {
    &.MuiTableRow-root {
      &:hover {
        cursor: default;
        background-color: transparent;
      }
    }
  }
`;

export const StyledCheckbox = styled(Checkbox)`
  & svg {
    fill: ${variables.palette.primary};
  }
`;

export const StyledTableCell = styled(TableCell)`
  position: relative;

  &:before {
    content: ' ';
    visibility: hidden;
  }

  padding-bottom: ${theme.spacing(2)};
`;

export const StyledHeadCell = styled(TableCell, shouldForwardProp)`
  &.MuiTableCell-head {
    background-color: ${({ tableHeadBackground }: { tableHeadBackground?: string }) =>
      tableHeadBackground ?? variables.palette.surface1};
  }
`;

import { Checkbox, styled, TableCell, TableContainer } from '@mui/material';

import { theme, variables } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils';

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

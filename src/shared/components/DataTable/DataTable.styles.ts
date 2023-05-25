import { Checkbox, styled, TableCell, TableContainer } from '@mui/material';

import { variables } from 'shared/styles';
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
  padding-bottom: 2rem;
`;

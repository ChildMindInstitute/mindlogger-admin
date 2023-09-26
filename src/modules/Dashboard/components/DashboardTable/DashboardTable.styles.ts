import { styled, TableCell } from '@mui/material';

import { variables } from 'shared/styles/variables';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';

export const StyledTableCell = styled(TableCell, shouldForwardProp)`
  font-size: ${variables.font.size.md};
  line-height: ${variables.font.lineHeight.md};
  letter-spacing: ${variables.font.letterSpacing.sm};

  ${({ hasColFixedWidth, width }: { hasColFixedWidth?: boolean; width?: string }) =>
    hasColFixedWidth &&
    `
    display: flex;
    align-items: center;
    flex-basis: ${width ?? 'auto'};
    flex-grow: ${width ? 'unset' : 1};
  `};
`;

import { styled, TableCell } from '@mui/material';

import { variables } from 'shared/styles/variables';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';

export const StyledTableCell = styled(TableCell, shouldForwardProp)`
  font-size: ${variables.font.size.md};
  line-height: ${variables.font.lineHeight.md};
  letter-spacing: ${variables.font.letterSpacing.sm};
  word-break: break-all;

  ${({ hasColFixedWidth, width }: { hasColFixedWidth?: boolean; width?: string }) => {
    if (hasColFixedWidth) {
      return `
        display: flex;
        align-items: center;
        flex-basis: ${width ?? 'auto'};
        flex-grow: ${width ? 'unset' : 1};
      `;
    }

    return `
      height: 4.8rem;
    `;
  }}
`;

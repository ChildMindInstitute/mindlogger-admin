import { styled, TableCell } from '@mui/material';

import { TableHead } from 'shared/components';
import { variables } from 'shared/styles/variables';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';

export const StyledTableCell = styled(TableCell, shouldForwardProp)`
  font-size: ${variables.font.size.lg};
  letter-spacing: ${variables.font.letterSpacing.sm};
  line-height: ${variables.font.lineHeight.lg};

  &&:first-of-type {
    padding-left: 2rem;
  }

  ${({ hasColFixedWidth, width }: { hasColFixedWidth?: boolean; width?: string }) => {
    if (hasColFixedWidth) {
      return `
        display: flex;
        align-items: center;
        flex-basis: ${width ?? 'auto'};
        flex-grow: ${width ? 'unset' : 1};
      `;
    }

    return { paddingTop: 12, paddingBottom: 12 };
  }}
`;

export const StyledTableHead = styled(TableHead)({
  '&& tr:nth-of-type(2) th': { padding: '1.2rem' },
  '&& tr th:first-of-type': { paddingLeft: '2rem' },
});

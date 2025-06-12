import { styled, TableCell } from '@mui/material';

import { TableHead } from 'shared/components';
import { theme } from 'shared/styles';
import { variables } from 'shared/styles/variables';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';

export const StyledTableCell = styled(TableCell, shouldForwardProp)`
  font-size: ${variables.font.size.body2};
  line-height: ${variables.font.lineHeight.body2};
  letter-spacing: ${variables.font.letterSpacing.sm};
  height: ${theme.spacing(6.4)};

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

    return { paddingTop: theme.spacing(1.2), paddingBottom: theme.spacing(1.2) };
  }}
`;

export const StyledTableHead = styled(TableHead)(
  ({ enablePagination = true }: { enablePagination?: boolean }) => ({
    '&& tr:nth-of-type(2) th': { padding: '1.2rem' },
    '&& tr th:first-of-type': { paddingLeft: '2rem' },
    ...(enablePagination ? {} : { '&& th': { top: 0 } }),
  }),
);

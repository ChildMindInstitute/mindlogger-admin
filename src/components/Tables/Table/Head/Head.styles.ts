import { styled, TableHead, TableCell } from '@mui/material';

import { shouldForwardProp } from 'utils/shouldForwardProp';

const HEAD_ROW_HEIGHT = '5.3rem';

export const StyledTableHead = styled(TableHead, shouldForwardProp)`
  .MuiTableCell-root {
    ${({ headBackground }: { headBackground?: string }) =>
      headBackground && `background-color: ${headBackground}`};
  }
`;

export const StyledTableCell = styled(TableCell, shouldForwardProp)`
  top: ${({ hidePagination = false }: { hidePagination?: boolean }) =>
    hidePagination ? 0 : HEAD_ROW_HEIGHT};
`;

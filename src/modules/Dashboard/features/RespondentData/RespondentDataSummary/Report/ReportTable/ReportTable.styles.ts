import { Box, styled } from '@mui/material';

import { theme, variables } from 'shared/styles';

export const StyledTableWrapper = styled(Box)`
  margin-top: ${theme.spacing(2.4)};

  .MuiTableCell-root {
    font-size: ${variables.font.size.md};
  }

  thead {
    background-color: ${variables.palette.surface};
  }

  thead tr:first-of-type .MuiTableCell-root {
    border-bottom: none;
  }
`;

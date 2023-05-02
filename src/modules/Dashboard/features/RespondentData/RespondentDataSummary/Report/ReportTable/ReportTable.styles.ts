import { Box, styled } from '@mui/material';

import { theme, variables } from 'shared/styles';

export const StyledTableWrapper = styled(Box)`
  height: 37.5rem;
  margin-top: ${theme.spacing(2.4)};

  .MuiTableCell-root {
    font-size: ${variables.font.size.md};
  }

  thead tr:first-of-type .MuiTableCell-root {
    border-bottom: none;
  }
`;

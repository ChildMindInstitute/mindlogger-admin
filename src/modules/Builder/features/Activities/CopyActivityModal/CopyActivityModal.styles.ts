import { Box, styled } from '@mui/material';

import { variables } from 'shared/styles';

export const StyledTableWrapper = styled(Box)`
  .MuiTableRow-root.MuiTableRow-selected {
    background-color: ${variables.palette.secondary_container};
  }
`;

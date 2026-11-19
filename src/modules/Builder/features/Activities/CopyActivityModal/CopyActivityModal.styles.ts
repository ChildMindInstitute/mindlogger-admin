import { Box, styled } from '@mui/material';

import { variables } from 'shared/styles';

export const StyledTableWrapper = styled(Box)`
  .MuiTableRow-root:has(.Mui-checked) {
    background-color: ${variables.palette.secondary_container};
  }
`;

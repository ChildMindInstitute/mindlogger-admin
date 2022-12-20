import { Box, styled } from '@mui/material';

import { variables } from 'styles/variables';

export const StyledIcon = styled(Box)`
  display: flex;
  margin-right: 0.8rem;

  svg {
    fill: ${variables.palette.on_secondary_container};
  }
`;

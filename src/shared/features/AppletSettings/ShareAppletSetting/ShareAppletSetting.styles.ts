import { Box, Button, styled } from '@mui/material';

import { variables } from 'shared/styles/variables';

export const StyledContainer = styled(Box)`
  width: 54.6rem;
  form > div {
    padding: 0;
  }
`;

export const StyledButton = styled(Button)`
  width: 12rem;
  height: 5rem;
  svg {
    fill: ${({ disabled }) =>
      disabled ? variables.palette.on_surface_alpha38 : variables.palette.primary};
  }
`;

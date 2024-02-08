import { styled, Box, Button } from '@mui/material';

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
    fill: ${({ disabled }) => (disabled ? variables.palette.on_surface_alfa38 : variables.palette.primary)};
  }
`;

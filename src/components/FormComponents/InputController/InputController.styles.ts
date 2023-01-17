import { styled, Box, TextField } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';

export const StyledTextField = styled(TextField)`
  input[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

export const StyledUpDown = styled(Box)`
  display: flex;
  flex-direction: column;
  margin-left: ${theme.spacing(1.5)};

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;

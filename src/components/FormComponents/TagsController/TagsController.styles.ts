import { styled, TextField, Box } from '@mui/material';

import { variables } from 'styles/variables';

export const StyledTextField = styled(TextField)`
  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;

export const StyledChipsWrapper = styled(Box)`
  display: flex;
  flex-wrap: wrap;
`;
